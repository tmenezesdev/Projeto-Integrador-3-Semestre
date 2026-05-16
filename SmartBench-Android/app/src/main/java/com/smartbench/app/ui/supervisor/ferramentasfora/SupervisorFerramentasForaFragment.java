package com.smartbench.app.ui.supervisor.ferramentasfora;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.request.DevolucaoRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentSupervisorFerramentasForaBinding;
import com.smartbench.app.ui.common.adapters.FerramentasAdapter;
import com.smartbench.app.ui.supervisor.atrasos.dialogs.DevolucaoBottomSheet;

public class SupervisorFerramentasForaFragment extends Fragment {

    private FragmentSupervisorFerramentasForaBinding binding;
    private SupervisorFerramentasForaViewModel viewModel;
    private FerramentasAdapter adapter;

    private final Handler refreshHandler = new Handler(Looper.getMainLooper());
    private final Runnable refreshRunnable = new Runnable() {
        @Override
        public void run() {
            viewModel.carregar();
            refreshHandler.postDelayed(this, 30_000);
        }
    };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentSupervisorFerramentasForaBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(SupervisorFerramentasForaViewModel.class);

        adapter = new FerramentasAdapter(new FerramentasAdapter.OnItemAction() {
            @Override public void onEditar(Ferramenta f) {}
            @Override public void onDeletar(Ferramenta f) {}
            @Override public void onClick(Ferramenta f) { abrirDevolucao(f); }
        }, false);

        binding.rvFerramentasFora.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.rvFerramentasFora.setAdapter(adapter);

        binding.btnAtualizar.setOnClickListener(v -> viewModel.carregar());

        viewModel.ferramentasFora.observe(getViewLifecycleOwner(), resource -> {
            switch (resource.status) {
                case LOADING: binding.progressBar.setVisibility(View.VISIBLE); break;
                case SUCCESS:
                    binding.progressBar.setVisibility(View.GONE);
                    if (resource.data != null) {
                        adapter.setData(resource.data);
                        int total = resource.data.size();
                        int atrasadas = 0;
                        for (Ferramenta f : resource.data) { if (f.isAtrasada()) atrasadas++; }
                        binding.tvTotal.setText(String.valueOf(total));
                        binding.tvEmUso.setText(String.valueOf(total - atrasadas));
                        binding.tvAtrasadas.setText(String.valueOf(atrasadas));
                    }
                    break;
                case ERROR:
                    binding.progressBar.setVisibility(View.GONE);
                    Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
                    break;
            }
        });

        viewModel.devolucaoResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Devolução registrada!", Toast.LENGTH_SHORT).show();
                viewModel.carregar();
            }
        });
    }

    private void abrirDevolucao(Ferramenta f) {
        DevolucaoBottomSheet sheet = DevolucaoBottomSheet.newInstance(f);
        sheet.setOnConfirmar(obs -> {
            int supervisorId = SessionManager.getInstance(requireContext()).getUserId();
            viewModel.devolver(new DevolucaoRequest(f.id, supervisorId, obs));
        });
        sheet.show(getChildFragmentManager(), "devolucao");
    }

    @Override public void onResume() { super.onResume(); refreshHandler.post(refreshRunnable); }
    @Override public void onPause() { super.onPause(); refreshHandler.removeCallbacks(refreshRunnable); }
    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
