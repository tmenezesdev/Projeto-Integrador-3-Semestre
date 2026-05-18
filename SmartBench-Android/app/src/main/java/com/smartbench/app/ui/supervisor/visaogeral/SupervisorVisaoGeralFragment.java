package com.smartbench.app.ui.supervisor.visaogeral;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.google.android.material.color.MaterialColors;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.response.DashboardSupervisorResponse;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentSupervisorVisaoGeralBinding;
import com.smartbench.app.ui.common.adapters.FerramentasAdapter;

import java.util.ArrayList;
import java.util.List;

public class SupervisorVisaoGeralFragment extends Fragment {

    private FragmentSupervisorVisaoGeralBinding binding;
    private SupervisorVisaoGeralViewModel viewModel;
    private FerramentasAdapter adapterFora;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentSupervisorVisaoGeralBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(SupervisorVisaoGeralViewModel.class);

        // Adapter da lista "Ferramentas Fora Agora"
        adapterFora = new FerramentasAdapter(new FerramentasAdapter.OnItemAction() {
            @Override public void onEditar(Ferramenta f) {}
            @Override public void onDeletar(Ferramenta f) {}
            @Override public void onClick(Ferramenta f) {}
        }, false);
        binding.rvFerramentasFora.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvFerramentasFora.setAdapter(adapterFora);

        setupChipGroup();

        binding.swipeRefresh.setOnRefreshListener(() -> {
            viewModel.carregar();
            viewModel.carregarFluxo(periodoAtual());
        });

        // Observer: dados gerais (totalFerramentas, transacoesHoje, mecanicosAtivos)
        viewModel.visaoGeral.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING:
                    binding.swipeRefresh.setRefreshing(true);
                    break;
                case SUCCESS:
                    binding.swipeRefresh.setRefreshing(false);
                    if (resource.data != null) populateDashboard(resource.data);
                    break;
                case ERROR:
                    binding.swipeRefresh.setRefreshing(false);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
                    break;
            }
        });

        // Observer: ferramentas fora → Em Uso, Atrasadas, Taxa no Prazo, lista
        viewModel.ferramentasFora.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                List<Ferramenta> lista = resource.data;
                int emUso = 0, atrasadas = 0;
                for (Ferramenta f : lista) {
                    if ("ATRASADA".equals(f.statusAlerta)) atrasadas++;
                    else emUso++;
                }
                binding.tvEmUso.setText(String.valueOf(emUso));
                binding.tvAtrasadas.setText(String.valueOf(atrasadas));
                atualizarTaxa(emUso, atrasadas);

                List<Ferramenta> preview = lista.subList(0, Math.min(7, lista.size()));
                adapterFora.setData(new ArrayList<>(preview));
            }
        });

        // Observer: alertas → Alertas Ativos
        viewModel.alertas.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                int ativos = 0;
                for (Alerta a : resource.data) {
                    if ("ATIVO".equals(a.statusAlerta)) ativos++;
                }
                binding.tvAlertasAtivos.setText(String.valueOf(ativos));
            }
        });

        // Observer: fluxo do gráfico
        viewModel.fluxo.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                setupChart(resource.data);
            }
        });

        viewModel.carregar();
        viewModel.carregarFluxo(15); // padrão 15 dias como no web
    }

    private void populateDashboard(DashboardSupervisorResponse data) {
        binding.tvTotalFerramentas.setText(String.valueOf(data.totalFerramentas));
        binding.tvTransacoesHoje.setText(String.valueOf(data.transacoesHoje));
        binding.tvMecanicosAtivos.setText(String.valueOf(data.mecanicosAtivos));
    }

    private void atualizarTaxa(int emUso, int atrasadas) {
        int total = emUso + atrasadas;
        if (total == 0) {
            binding.tvTaxaPrazo.setText("100%");
            return;
        }
        int taxa = Math.round((float) emUso / total * 100);
        binding.tvTaxaPrazo.setText(taxa + "%");
    }

    private void setupChipGroup() {
        binding.chipGroupPeriodo.setOnCheckedStateChangeListener((group, ids) -> {
            if (ids.isEmpty()) return;
            int id = ids.get(0);
            int dias = 15;
            if (id == R.id.chip7d)  dias = 7;
            else if (id == R.id.chip90d) dias = 90;
            viewModel.carregarFluxo(dias);
        });
    }

    private int periodoAtual() {
        if (binding.chip7d.isChecked())  return 7;
        if (binding.chip90d.isChecked()) return 90;
        return 15;
    }

    private void setupChart(List<FluxoPonto> pontos) {
        if (pontos == null || pontos.isEmpty()) return;
        LineChart chart = binding.chartFluxo;
        chart.setBackgroundColor(Color.TRANSPARENT);
        chart.getDescription().setEnabled(false);
        chart.getLegend().setTextColor(Color.parseColor("#9CA3AF"));
        chart.setDrawGridBackground(false);

        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.parseColor("#9CA3AF"));
        xAxis.setTextSize(10f);
        xAxis.setDrawGridLines(false);
        xAxis.setGranularity(1f);
        // Quantidade de labels visíveis proporcional ao período
        int labelCount = pontos.size() <= 7 ? pontos.size() : pontos.size() <= 15 ? 5 : 6;
        xAxis.setLabelCount(labelCount, true);
        xAxis.setLabelRotationAngle(-35f);

        List<String> labels = new ArrayList<>();
        List<Entry> ret = new ArrayList<>(), dev = new ArrayList<>();
        for (int i = 0; i < pontos.size(); i++) {
            FluxoPonto p = pontos.get(i);
            // Backend retorna "14. jan" — mostrar só o dia
            String d = p.data != null ? p.data.split("\\.")[0].trim() : "";
            labels.add(d);
            ret.add(new Entry(i, p.retiradas));
            dev.add(new Entry(i, p.devolucoes));
        }
        xAxis.setValueFormatter(new IndexAxisValueFormatter(labels));
        chart.getAxisLeft().setTextColor(Color.parseColor("#9CA3AF"));
        chart.getAxisLeft().setGridColor(Color.parseColor("#1F2937"));
        chart.getAxisRight().setEnabled(false);

        int primaryColor = MaterialColors.getColor(binding.chartFluxo,
                com.google.android.material.R.attr.colorPrimary, Color.WHITE);

        // Retiradas — cor do perfil (teal para Supervisor)
        LineDataSet setRet = new LineDataSet(ret, "Retiradas");
        setRet.setColor(primaryColor);
        setRet.setFillColor(primaryColor);
        setRet.setDrawFilled(true);
        setRet.setFillAlpha(45);
        setRet.setLineWidth(2f);
        setRet.setDrawCircles(false);
        setRet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        setRet.setValueTextColor(Color.TRANSPARENT);

        // Devoluções — cinza #475569 (igual ao web)
        LineDataSet setDev = new LineDataSet(dev, "Devoluções");
        setDev.setColor(0xFF475569);
        setDev.setFillColor(0xFF475569);
        setDev.setDrawFilled(true);
        setDev.setFillAlpha(30);
        setDev.setLineWidth(2f);
        setDev.setDrawCircles(false);
        setDev.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        setDev.setValueTextColor(Color.TRANSPARENT);

        chart.setData(new LineData(setRet, setDev));
        chart.animateX(600);
        chart.invalidate();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
