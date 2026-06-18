package com.smartbench.app.ui.mecanico.ferramentas.dialogs;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.smartbench.app.R;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.databinding.BottomsheetDevolucaoMecanicoBinding;

public class DevolucaoMecanicoBottomSheet extends BottomSheetDialogFragment {

    private BottomsheetDevolucaoMecanicoBinding binding;
    private Ferramenta ferramenta;
    private OnConfirmarListener listener;

    public interface OnConfirmarListener { void onConfirmar(String cracha); }

    public static DevolucaoMecanicoBottomSheet newInstance(Ferramenta f) {
        DevolucaoMecanicoBottomSheet sheet = new DevolucaoMecanicoBottomSheet();
        sheet.ferramenta = f;
        return sheet;
    }

    public void setOnConfirmar(OnConfirmarListener l) { this.listener = l; }

    @Override public int getTheme() { return R.style.SmartBench_BottomSheetDialog; }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = BottomsheetDevolucaoMecanicoBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        if (ferramenta != null) {
            binding.tvFerramenta.setText(ferramenta.nome != null ? ferramenta.nome : "--");
            binding.tvTag.setText(ferramenta.getTagRfid() != null ? ferramenta.getTagRfid() : "--");
        }

        binding.btnCancelar.setOnClickListener(v -> dismiss());
        binding.btnConfirmar.setOnClickListener(v -> {
            String cracha = binding.etCracha.getText() != null ? binding.etCracha.getText().toString().trim() : "";
            if (cracha.isEmpty()) {
                binding.tilCracha.setError("Obrigatório");
                return;
            }
            binding.tilCracha.setError(null);
            if (listener != null) listener.onConfirmar(cracha);
            dismiss();
        });
    }

    @Override public void onDestroyView() { super.onDestroyView(); binding = null; }
}
