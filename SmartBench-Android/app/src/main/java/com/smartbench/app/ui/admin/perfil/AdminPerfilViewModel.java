package com.smartbench.app.ui.admin.perfil;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.request.AlterarSenhaRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;
import java.util.Map;

public class AdminPerfilViewModel extends AndroidViewModel {
    private final AdminRepository repository;
    public final MutableLiveData<Resource<Usuario>> perfil = new MutableLiveData<>();
    public final MutableLiveData<Resource<Map<String, Integer>>> stats = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> senhaResult = new MutableLiveData<>();

    public AdminPerfilViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregar() {
        repository.getPerfil(perfil);
        repository.getStats(stats);
    }

    public void alterarSenha(String senhaAtual, String novaSenha) {
        repository.alterarSenha(new AlterarSenhaRequest(senhaAtual, novaSenha), senhaResult);
    }
}
