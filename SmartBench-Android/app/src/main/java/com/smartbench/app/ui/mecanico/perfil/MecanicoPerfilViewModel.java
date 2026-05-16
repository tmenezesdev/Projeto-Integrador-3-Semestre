package com.smartbench.app.ui.mecanico.perfil;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.MecanicoRepository;

public class MecanicoPerfilViewModel extends AndroidViewModel {
    private final MecanicoRepository repository;
    public final MutableLiveData<Resource<Usuario>> perfil = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> senhaResult = new MutableLiveData<>();

    public MecanicoPerfilViewModel(@NonNull Application application) {
        super(application);
        repository = new MecanicoRepository(application);
    }

    public void carregar() { repository.getPerfil(perfil); }
    public void alterarSenha(String atual, String nova) {
        repository.alterarSenha(new AlterarSenhaRequest(atual, nova), senhaResult);
    }
}
