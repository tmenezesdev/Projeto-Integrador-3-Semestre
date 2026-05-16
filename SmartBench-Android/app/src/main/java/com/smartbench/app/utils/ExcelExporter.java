package com.smartbench.app.utils;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;

import androidx.core.content.FileProvider;

import com.opencsv.CSVWriter;
import com.smartbench.app.data.model.entity.Transacao;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class ExcelExporter {

    public static void exportarECompartilhar(Context context, List<Transacao> lista) throws IOException {
        File dir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
        if (dir == null) throw new IOException("Diretório de downloads não disponível");

        String fileName = "historico_smartbench_" + System.currentTimeMillis() + ".csv";
        File arquivo = new File(dir, fileName);

        try (CSVWriter writer = new CSVWriter(new FileWriter(arquivo))) {
            writer.writeNext(new String[]{"ID", "Data/Hora", "Ferramenta", "Tag RFID", "Responsável", "Cargo", "Operação", "Método", "Observação"});
            for (Transacao t : lista) {
                writer.writeNext(new String[]{
                        String.valueOf(t.id),
                        DateUtils.formatDisplay(t.dataHora),
                        t.ferramenta != null ? t.ferramenta : "--",
                        t.tagRfid != null ? t.tagRfid : "--",
                        t.responsavel != null ? t.responsavel : "--",
                        t.cargo != null ? t.cargo : "--",
                        t.tipo != null ? t.tipo : "--",
                        t.metodo != null ? t.metodo : "--",
                        t.observacao != null ? t.observacao : ""
                });
            }
        }

        Uri uri = FileProvider.getUriForFile(context, context.getPackageName() + ".fileprovider", arquivo);
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/csv");
        shareIntent.putExtra(Intent.EXTRA_STREAM, uri);
        shareIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        context.startActivity(Intent.createChooser(shareIntent, "Exportar Histórico"));
    }
}
