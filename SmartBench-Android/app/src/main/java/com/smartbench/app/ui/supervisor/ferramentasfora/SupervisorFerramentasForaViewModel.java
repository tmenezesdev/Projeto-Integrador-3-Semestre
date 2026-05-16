package com.smartbench.app.ui.supervisor.ferramentasfora;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.request.DevolucaoRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.SupervisorRepository;
import java.util.List;

public class SupervisorFerramentasForaViewModel extends AndroidViewModel {
    private final SupervisorRepository repository;
    public final MutableLiveData<Resource<List<Ferramenta>>> ferramentasFora = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> devolucaoResult = new MutableLiveData<>();

    public SupervisorFerramentasForaViewModel(@NonNull Application application) {
        super(application);
        repository = new SupervisorRepository(application);
    }

    public void carregar() { repository.getFerramentasFora(ferramentasFora); }
    public void devolver(DevolucaoRequest req) { repository.registrarDevolucao(req, devolucaoResult); }
}
