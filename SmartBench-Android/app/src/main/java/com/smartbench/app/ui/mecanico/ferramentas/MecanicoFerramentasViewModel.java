package com.smartbench.app.ui.mecanico.ferramentas;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.request.DevolucaoMecanicoRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.MecanicoRepository;
import java.util.List;

public class MecanicoFerramentasViewModel extends AndroidViewModel {
    private final MecanicoRepository repository;
    public final MutableLiveData<Resource<List<Ferramenta>>> ferramentas = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> devolucaoResult = new MutableLiveData<>();

    public MecanicoFerramentasViewModel(@NonNull Application application) {
        super(application);
        repository = new MecanicoRepository(application);
    }

    public void carregar() { repository.getFerramentas(ferramentas); }

    public void devolver(DevolucaoMecanicoRequest req) { repository.registrarDevolucao(req, devolucaoResult); }
}
