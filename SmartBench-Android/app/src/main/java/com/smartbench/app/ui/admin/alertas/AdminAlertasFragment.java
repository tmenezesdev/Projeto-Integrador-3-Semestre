package com.smartbench.app.ui.admin.alertas;

import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.databinding.FragmentListSearchBinding;
import com.smartbench.app.ui.common.adapters.AlertasAdapter;

public class AdminAlertasFragment extends Fragment {

    private FragmentListSearchBinding binding;
    private AdminAlertasViewModel viewModel;
    private AlertasAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentListSearchBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(AdminAlertasViewModel.class);

        binding.tvTitle.setText("Alertas");
        binding.btnAction.setVisibility(View.GONE);
        binding.layoutPaginacao.setVisibility(View.GONE);

        adapter = new AlertasAdapter(alerta -> viewModel.resolver(alerta.id), true);

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        binding.etBusca.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) { adapter.filter(s.toString()); }
            @Override public void afterTextChanged(Editable s) {}
        });

        viewModel.alertas.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.progressBar.setVisibility(View.VISIBLE); break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    if (resource.data != null && !resource.data.isEmpty()) {
                        adapter.setData(resource.data);
                        binding.layoutVazio.setVisibility(View.GONE);
                    } else binding.layoutVazio.setVisibility(View.VISIBLE);
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
                    break;
            }
        });

        viewModel.resolverResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == com.smartbench.app.data.model.response.Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Alerta resolvido", Toast.LENGTH_SHORT).show();
                viewModel.carregar();
            }
        });

        viewModel.carregar();
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
