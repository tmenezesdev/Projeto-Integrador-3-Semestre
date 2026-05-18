package com.smartbench.app.ui.supervisor.perfil;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.SupervisorRepository;

public class SupervisorPerfilViewModel extends AndroidViewModel {
    private final SupervisorRepository repository;
    public final MutableLiveData<Resource<Usuario>> perfil = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> senhaResult = new MutableLiveData<>();

    public SupervisorPerfilViewModel(@NonNull Application application) {
        super(application);
        repository = new SupervisorRepository(application);
    }

    public void carregar() { repository.getPerfil(perfil); }

    public void alterarSenha(String atual, String nova) {
        repository.alterarSenha(new AlterarSenhaRequest(atual, nova), senhaResult);
    }
}
