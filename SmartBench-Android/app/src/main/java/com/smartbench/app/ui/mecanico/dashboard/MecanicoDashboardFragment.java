package com.smartbench.app.ui.mecanico.dashboard;

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

import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.databinding.FragmentMecanicoDashboardBinding;
import com.smartbench.app.ui.common.adapters.TransacoesAdapter;

public class MecanicoDashboardFragment extends Fragment {

    private FragmentMecanicoDashboardBinding binding;
    private MecanicoDashboardViewModel viewModel;
    private TransacoesAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentMecanicoDashboardBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(MecanicoDashboardViewModel.class);

        adapter = new TransacoesAdapter();
        binding.rvRetiradas.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvRetiradas.setAdapter(adapter);

        binding.swipeRefresh.setOnRefreshListener(() -> viewModel.carregar());

        viewModel.retiradas.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.swipeRefresh.setRefreshing(true); break;
                case SUCCESS:
                    binding.swipeRefresh.setRefreshing(false);
                    if (resource.data != null && !resource.data.isEmpty()) {
                        adapter.setData(resource.data);
                        binding.tvVazio.setVisibility(View.GONE);
                    } else {
                        binding.tvVazio.setVisibility(View.VISIBLE);
                    }
                    break;
                case ERROR:
                    binding.swipeRefresh.setRefreshing(false);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
                    break;
            }
        });

        viewModel.carregar();
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
