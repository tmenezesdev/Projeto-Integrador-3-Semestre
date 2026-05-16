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
import com.smartbench.app.R;
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
    private FerramentasAdapter ferramentasAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSupervisorVisaoGeralBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(SupervisorVisaoGeralViewModel.class);

        ferramentasAdapter = new FerramentasAdapter(new FerramentasAdapter.OnItemAction() {
            @Override public void onEditar(com.smartbench.app.data.model.entity.Ferramenta f) {}
            @Override public void onDeletar(com.smartbench.app.data.model.entity.Ferramenta f) {}
            @Override public void onClick(com.smartbench.app.data.model.entity.Ferramenta f) {}
        }, false);

        binding.rvFerramentasFora.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvFerramentasFora.setAdapter(ferramentasAdapter);

        setupChipGroup();

        binding.swipeRefresh.setOnRefreshListener(() -> {
            viewModel.carregar();
            viewModel.carregarFluxo(7);
        });

        viewModel.visaoGeral.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.swipeRefresh.setRefreshing(true); break;
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

        viewModel.fluxo.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                setupChart(resource.data);
            }
        });

        viewModel.carregar();
        viewModel.carregarFluxo(7);
    }

    private void setupChipGroup() {
        binding.chipGroupPeriodo.setOnCheckedStateChangeListener((group, ids) -> {
            if (ids.isEmpty()) return;
            int id = ids.get(0);
            int dias = 7;
            if (id == R.id.chip15d) dias = 15;
            else if (id == R.id.chip90d) dias = 90;
            viewModel.carregarFluxo(dias);
        });
    }

    private void populateDashboard(DashboardSupervisorResponse data) {
        binding.tvTotalFerramentas.setText(String.valueOf(data.totalFerramentas));
        binding.tvEmUso.setText(String.valueOf(data.emUso));
        binding.tvAtrasadas.setText(String.valueOf(data.atrasadas));
        binding.tvAlertasAtivos.setText(String.valueOf(data.alertasAtivos));
        binding.tvTransacoesHoje.setText(String.valueOf(data.transacoesHoje));
        binding.tvMecanicosAtivos.setText(String.valueOf(data.mecanicosAtivos));
        String taxa = String.format("%.0f%%", data.taxaNoPrazo);
        binding.tvTaxaPrazo.setText(taxa);

        if (data.ferramentasFora != null) ferramentasAdapter.setData(data.ferramentasFora);
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
        xAxis.setDrawGridLines(false);

        List<String> labels = new ArrayList<>();
        List<Entry> ret = new ArrayList<>(), dev = new ArrayList<>();
        for (int i = 0; i < pontos.size(); i++) {
            FluxoPonto p = pontos.get(i);
            String d = p.data != null && p.data.length() >= 10 ? p.data.substring(5) : p.data;
            labels.add(d != null ? d : "");
            ret.add(new Entry(i, p.retiradas));
            dev.add(new Entry(i, p.devolucoes));
        }
        xAxis.setValueFormatter(new IndexAxisValueFormatter(labels));
        chart.getAxisLeft().setTextColor(Color.parseColor("#9CA3AF"));
        chart.getAxisRight().setEnabled(false);

        int primaryColor = 0xFF2DD4BF; // Supervisor teal

        LineDataSet setRet = new LineDataSet(ret, "Retiradas");
        setRet.setColor(primaryColor); setRet.setFillColor(primaryColor);
        setRet.setDrawFilled(true); setRet.setFillAlpha(30); setRet.setLineWidth(2f);
        setRet.setDrawCircles(false); setRet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        setRet.setValueTextColor(Color.TRANSPARENT);

        LineDataSet setDev = new LineDataSet(dev, "Devoluções");
        setDev.setColor(0xFF22C55E); setDev.setFillColor(0xFF22C55E);
        setDev.setDrawFilled(true); setDev.setFillAlpha(30); setDev.setLineWidth(2f);
        setDev.setDrawCircles(false); setDev.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        setDev.setValueTextColor(Color.TRANSPARENT);

        chart.setData(new LineData(setRet, setDev));
        chart.animateX(600); chart.invalidate();
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
