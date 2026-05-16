package com.smartbench.app.ui.admin.usuarios;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.smartbench.app.data.model.entity.Usuario;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;

import java.util.List;

public class AdminUsuariosViewModel extends AndroidViewModel {

    private final AdminRepository repository;
    public final MutableLiveData<Resource<List<Usuario>>> usuarios = new MutableLiveData<>();
    public final MutableLiveData<Resource<Usuario>> operacaoUsuario = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> deletarResult = new MutableLiveData<>();

    public AdminUsuariosViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregar() { repository.getUsuarios(usuarios); }
    public void criar(Usuario u) { repository.criarUsuario(u, operacaoUsuario); }
    public void editar(int id, Usuario u) { repository.editarUsuario(id, u, operacaoUsuario); }
    public void deletar(int id) { repository.deletarUsuario(id, deletarResult); }
}
