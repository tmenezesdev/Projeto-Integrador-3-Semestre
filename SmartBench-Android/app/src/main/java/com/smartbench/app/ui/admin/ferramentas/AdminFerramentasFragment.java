package com.smartbench.app.ui.admin.ferramentas;

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

import com.google.android.material.dialog.MaterialAlertDialogBuilder;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.databinding.FragmentListSearchBinding;
import com.smartbench.app.ui.admin.ferramentas.dialogs.CriarEditarFerramentaBottomSheet;
import com.smartbench.app.ui.common.adapters.FerramentasAdapter;

public class AdminFerramentasFragment extends Fragment {

    private FragmentListSearchBinding binding;
    private AdminFerramentasViewModel viewModel;
    private FerramentasAdapter adapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        binding = FragmentListSearchBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        viewModel = new ViewModelProvider(this).get(AdminFerramentasViewModel.class);

        binding.tvTitle.setText("Ferramentas");
        binding.btnAction.setVisibility(View.VISIBLE);
        binding.btnAction.setText("Nova");
        binding.layoutPaginacao.setVisibility(View.GONE);

        adapter = new FerramentasAdapter(new FerramentasAdapter.OnItemAction() {
            @Override public void onEditar(Ferramenta f) { abrirEditar(f); }
            @Override public void onDeletar(Ferramenta f) { confirmarDelete(f); }
            @Override public void onClick(Ferramenta f) {}
        }, true);

        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        binding.btnAction.setOnClickListener(v -> abrirCriar());

        binding.etBusca.addTextChangedListener(new TextWatcher() {
            @Override public void beforeTextChanged(CharSequence s, int i, int i1, int i2) {}
            @Override public void onTextChanged(CharSequence s, int i, int i1, int i2) {
                adapter.filter(s.toString());
            }
            @Override public void afterTextChanged(Editable s) {}
        });

        viewModel.ferramentas.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.LOADING) {
                binding.progressBar.setVisibility(View.VISIBLE);
            } else if (resource.status == Resource.Status.SUCCESS) {
                binding.progressBar.setVisibility(View.GONE);
                boolean vazio = resource.data == null || resource.data.isEmpty();
                binding.layoutVazio.setVisibility(vazio ? View.VISIBLE : View.GONE);
                if (!vazio) adapter.setData(resource.data);
            } else {
                binding.progressBar.setVisibility(View.GONE);
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_SHORT).show();
            }
        });

        viewModel.operacao.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Operação realizada", Toast.LENGTH_SHORT).show();
                viewModel.carregar();
            } else if (resource.status == Resource.Status.ERROR) {
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_LONG).show();
            }
        });

        viewModel.deletarResult.observe(getViewLifecycleOwner(), resource -> {
            if (resource.status == Resource.Status.SUCCESS) {
                Toast.makeText(requireContext(), "Ferramenta excluída", Toast.LENGTH_SHORT).show();
                viewModel.carregar();
            } else if (resource.status == Resource.Status.ERROR) {
                Toast.makeText(requireContext(), resource.message, Toast.LENGTH_LONG).show();
            }
        });

        viewModel.carregar();
    }

    private void abrirCriar() {
        CriarEditarFerramentaBottomSheet sheet = CriarEditarFerramentaBottomSheet.newInstance(null);
        sheet.setOnSave(f -> viewModel.criar(f));
        sheet.show(getChildFragmentManager(), "criar_ferramenta");
    }

    private void abrirEditar(Ferramenta f) {
        CriarEditarFerramentaBottomSheet sheet = CriarEditarFerramentaBottomSheet.newInstance(f);
        sheet.setOnSave(ferramenta -> viewModel.editar(f.id, ferramenta));
        sheet.show(getChildFragmentManager(), "editar_ferramenta");
    }

    private void confirmarDelete(Ferramenta f) {
        new MaterialAlertDialogBuilder(requireContext())
                .setTitle(getString(R.string.dialog_deletar_titulo))
                .setMessage(getString(R.string.dialog_deletar_msg, f.nome))
                .setPositiveButton(R.string.btn_excluir, (d, w) -> viewModel.deletar(f.id))
                .setNegativeButton(R.string.btn_cancelar, null)
                .show();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
