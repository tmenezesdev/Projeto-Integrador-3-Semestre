package com.smartbench.app.ui.mecanico.ferramentas;

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

import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.databinding.FragmentListSearchBinding;
import com.smartbench.app.ui.common.adapters.FerramentasAdapter;
import com.smartbench.app.utils.DateUtils;

import android.widget.TextView;
import com.smartbench.app.R;

public class MecanicoFerramentasFragment extends Fragment {

    private FragmentListSearchBinding binding;
    private MecanicoFerramentasViewModel viewModel;
    private FerramentasAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentListSearchBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(MecanicoFerramentasViewModel.class);

        binding.tvTitle.setText("Ferramentas");
        binding.btnAction.setVisibility(View.GONE);
        binding.layoutPaginacao.setVisibility(View.GONE);

        adapter = new FerramentasAdapter(new FerramentasAdapter.OnItemAction() {
            @Override public void onEditar(Ferramenta f) {}
            @Override public void onDeletar(Ferramenta f) {}
            @Override public void onClick(Ferramenta f) {
                if ("EM_USO".equals(f.status)) mostrarDetalhes(f);
            }
        }, false);

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        binding.etBusca.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) { adapter.filter(s.toString()); }
            @Override public void afterTextChanged(Editable s) {}
        });

        viewModel.ferramentas.observe(getViewLifecycleOwner(), resource -> {
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

        viewModel.carregar();
    }

    private void mostrarDetalhes(Ferramenta f) {
        BottomSheetDialog dialog = new BottomSheetDialog(requireContext(), R.style.SmartBench_BottomSheetDialog);
        View detView = LayoutInflater.from(requireContext()).inflate(R.layout.bottomsheet_detalhes_ferramenta, null);

        ((TextView) detView.findViewById(R.id.tvNome)).setText(f.nome != null ? f.nome : "--");
        ((TextView) detView.findViewById(R.id.tvTag)).setText(f.tagRfid != null ? f.tagRfid : "--");
        ((TextView) detView.findViewById(R.id.tvStatus)).setText(f.status != null ? f.status : "--");
        ((TextView) detView.findViewById(R.id.tvResponsavel)).setText(f.responsavel != null ? f.responsavel : "--");
        ((TextView) detView.findViewById(R.id.tvHoraRetirada)).setText(f.horaRetirada != null ? f.horaRetirada : "--");
        ((TextView) detView.findViewById(R.id.tvTempoFora)).setText(DateUtils.formatTempoFora(f.minutosFora));

        detView.findViewById(R.id.btnFechar).setOnClickListener(v -> dialog.dismiss());
        dialog.setContentView(detView);
        dialog.show();
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
