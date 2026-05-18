package com.smartbench.app.ui.admin.dashboard;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.google.android.material.color.MaterialColors;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.response.DashboardAdminResponse;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentAdminDashboardBinding;
import com.smartbench.app.ui.common.adapters.TransacoesAdapter;

import java.util.ArrayList;
import java.util.List;

public class AdminDashboardFragment extends Fragment {

    private FragmentAdminDashboardBinding binding;
    private AdminDashboardViewModel viewModel;
    private TransacoesAdapter atividadeAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentAdminDashboardBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(AdminDashboardViewModel.class);

        setupAtividadeRecente();
        setupChipGroup();
        setupObservers();
        setupSwipeRefresh();

        viewModel.carregarTudo(7);
    }

    private void setupAtividadeRecente() {
        atividadeAdapter = new TransacoesAdapter();
        binding.rvAtividadeRecente.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvAtividadeRecente.setAdapter(atividadeAdapter);
        binding.rvAtividadeRecente.setNestedScrollingEnabled(false);
    }

    private void setupChipGroup() {
        binding.chipGroupPeriodo.setOnCheckedStateChangeListener((group, checkedIds) -> {
            if (checkedIds.isEmpty()) return;
            int id = checkedIds.get(0);
            int dias = 7;
            if (id == R.id.chip15d) dias = 15;
            else if (id == R.id.chip90d) dias = 90;
            viewModel.carregarFluxo(dias);
        });
    }

    private void setupObservers() {
        viewModel.dashboard.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.LOADING) {
                binding.swipeRefresh.setRefreshing(true);
            } else if (resource.status == Resource.Status.SUCCESS) {
                binding.swipeRefresh.setRefreshing(false);
                populateDashboard(resource.data);
            } else {
                binding.swipeRefresh.setRefreshing(false);
            }
        });

        viewModel.fluxo.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null) {
                setupChart(resource.data);
            }
        });

        viewModel.atividadeRecente.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS && resource.data != null && !resource.data.isEmpty()) {
                int limit = Math.min(resource.data.size(), 5);
                atividadeAdapter.setData(resource.data.subList(0, limit));
            }
        });
    }

    private void setupSwipeRefresh() {
        binding.swipeRefresh.setOnRefreshListener(() -> {
            int diasSelecionados = 7;
            if (binding.chip15d.isChecked()) diasSelecionados = 15;
            else if (binding.chip90d.isChecked()) diasSelecionados = 90;
            viewModel.carregarTudo(diasSelecionados);
        });
    }

    private void populateDashboard(DashboardAdminResponse data) {
        if (data == null) return;
        binding.tvTotalFerramentas.setText(String.valueOf(data.totalFerramentas));
        binding.tvTotalUsuarios.setText(String.valueOf(data.totalUsuarios));
        binding.tvTransacoesHoje.setText(String.valueOf(data.transacoesHoje));
        binding.tvAlertasAtivos.setText(String.valueOf(data.alertasAtivos));
    }

    private void setupChart(List<FluxoPonto> pontos) {
        if (pontos == null || pontos.isEmpty()) return;

        LineChart chart = binding.chartFluxo;
        chart.setBackgroundColor(Color.TRANSPARENT);
        chart.getDescription().setEnabled(false);
        chart.getLegend().setTextColor(Color.parseColor("#9CA3AF"));
        chart.setDrawGridBackground(false);
        chart.setTouchEnabled(true);
        chart.setDragEnabled(true);
        chart.setScaleEnabled(false);

        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextColor(Color.parseColor("#9CA3AF"));
        xAxis.setDrawGridLines(false);
        xAxis.setGranularity(1f);

        List<String> labels = new ArrayList<>();
        for (FluxoPonto p : pontos) {
            String d = p.data != null && p.data.length() >= 10 ? p.data.substring(5) : p.data;
            labels.add(d != null ? d : "");
        }
        xAxis.setValueFormatter(new IndexAxisValueFormatter(labels));

        YAxis left = chart.getAxisLeft();
        left.setTextColor(Color.parseColor("#9CA3AF"));
        left.setDrawGridLines(true);
        left.setGridColor(0x33FFFFFF);
        chart.getAxisRight().setEnabled(false);

        List<Entry> retiradas = new ArrayList<>();
        List<Entry> devolucoes = new ArrayList<>();
        for (int i = 0; i < pontos.size(); i++) {
            retiradas.add(new Entry(i, pontos.get(i).retiradas));
            devolucoes.add(new Entry(i, pontos.get(i).devolucoes));
        }

        int primaryColor = MaterialColors.getColor(binding.chartFluxo,
                com.google.android.material.R.attr.colorPrimary, Color.WHITE);

        LineDataSet setRet = new LineDataSet(retiradas, "Retiradas");
        setRet.setColor(primaryColor);
        setRet.setFillColor(primaryColor);
        setRet.setDrawFilled(true);
        setRet.setFillAlpha(30);
        setRet.setLineWidth(2f);
        setRet.setDrawCircles(false);
        setRet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        setRet.setValueTextColor(Color.TRANSPARENT);

        LineDataSet setDev = new LineDataSet(devolucoes, "Devoluções");
        setDev.setColor(0xFF22C55E);
        setDev.setFillColor(0xFF22C55E);
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
