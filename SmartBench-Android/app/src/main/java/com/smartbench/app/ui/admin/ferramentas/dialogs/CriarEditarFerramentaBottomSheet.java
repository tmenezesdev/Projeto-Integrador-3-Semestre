package com.smartbench.app.ui.admin.ferramentas.dialogs;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.databinding.BottomsheetCriarFerramentaBinding;

public class CriarEditarFerramentaBottomSheet extends BottomSheetDialogFragment {

    private BottomsheetCriarFerramentaBinding binding;
    private Ferramenta ferramentaEdicao;
    private OnSaveListener listener;

    public interface OnSaveListener { void onSave(Ferramenta f); }

    public static CriarEditarFerramentaBottomSheet newInstance(@Nullable Ferramenta f) {
        CriarEditarFerramentaBottomSheet sheet = new CriarEditarFerramentaBottomSheet();
        sheet.ferramentaEdicao = f;
        return sheet;
    }

    public void setOnSave(OnSaveListener l) { this.listener = l; }

    @Override public int getTheme() { return R.style.SmartBench_BottomSheetDialog; }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = BottomsheetCriarFerramentaBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        String[] status = {"DISPONIVEL", "EM_USO", "MANUTENCAO"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_dropdown_item_1line, status);
        binding.spinnerStatus.setAdapter(adapter);

        boolean isEdicao = ferramentaEdicao != null;
        binding.tvTitulo.setText(isEdicao ? "Editar Ferramenta" : "Nova Ferramenta");

        if (isEdicao) {
            binding.etNome.setText(ferramentaEdicao.nome);
            binding.etTag.setText(ferramentaEdicao.tagRfid);
            if (ferramentaEdicao.pesoReferencia != null)
                binding.etPeso.setText(String.valueOf(ferramentaEdicao.pesoReferencia));
            for (int i = 0; i < status.length; i++) {
                if (status[i].equals(ferramentaEdicao.status)) { binding.spinnerStatus.setSelection(i); break; }
            }
        }

        binding.btnCancelar.setOnClickListener(v -> dismiss());
        binding.btnSalvar.setOnClickListener(v -> {
            String nome = binding.etNome.getText() != null ? binding.etNome.getText().toString().trim() : "";
            String tag = binding.etTag.getText() != null ? binding.etTag.getText().toString().trim().toUpperCase() : "";
            String pesoStr = binding.etPeso.getText() != null ? binding.etPeso.getText().toString().trim() : "";
            String stat = binding.spinnerStatus.getSelectedItem() != null ? binding.spinnerStatus.getSelectedItem().toString() : "DISPONIVEL";

            if (nome.isEmpty()) { binding.tilNome.setError("Obrigatório"); return; }
            if (tag.isEmpty()) { binding.tilTag.setError("Obrigatório"); return; }

            Ferramenta f = new Ferramenta();
            f.nome = nome;
            f.tagRfid = tag;
            f.status = stat;
            if (!pesoStr.isEmpty()) {
                try { f.pesoReferencia = Double.parseDouble(pesoStr); } catch (NumberFormatException ignored) {}
            }

            if (listener != null) listener.onSave(f);
            dismiss();
        });
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
