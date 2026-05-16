package com.smartbench.app.ui.supervisor.atrasos.dialogs;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.databinding.BottomsheetDevolucaoBinding;

public class DevolucaoBottomSheet extends BottomSheetDialogFragment {

    private BottomsheetDevolucaoBinding binding;
    private Ferramenta ferramenta;
    private OnConfirmarListener listener;

    public interface OnConfirmarListener { void onConfirmar(String observacao); }

    public static DevolucaoBottomSheet newInstance(Ferramenta f) {
        DevolucaoBottomSheet sheet = new DevolucaoBottomSheet();
        sheet.ferramenta = f;
        return sheet;
    }

    public void setOnConfirmar(OnConfirmarListener l) { this.listener = l; }

    @Override public int getTheme() { return R.style.SmartBench_BottomSheetDialog; }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = BottomsheetDevolucaoBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (ferramenta != null) {
            binding.tvFerramenta.setText(ferramenta.nome != null ? ferramenta.nome : "--");
            binding.tvTag.setText(ferramenta.tagRfid != null ? ferramenta.tagRfid : "--");
            binding.tvResponsavel.setText(ferramenta.responsavel != null ? ferramenta.responsavel : "--");
        }

        binding.btnCancelar.setOnClickListener(v -> dismiss());
        binding.btnConfirmar.setOnClickListener(v -> {
            String obs = binding.etObservacao.getText() != null ? binding.etObservacao.getText().toString() : "";
            if (listener != null) listener.onConfirmar(obs);
            dismiss();
        });
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
