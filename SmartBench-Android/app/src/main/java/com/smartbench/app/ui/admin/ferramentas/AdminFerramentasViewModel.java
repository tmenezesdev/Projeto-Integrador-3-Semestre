package com.smartbench.app.ui.admin.ferramentas;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Ferramenta;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;
import java.util.List;

public class AdminFerramentasViewModel extends AndroidViewModel {
    private final AdminRepository repository;
    public final MutableLiveData<Resource<List<Ferramenta>>> ferramentas = new MutableLiveData<>();
    public final MutableLiveData<Resource<Ferramenta>> operacao = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> deletarResult = new MutableLiveData<>();

    public AdminFerramentasViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregar() { repository.getFerramentas(ferramentas); }
    public void criar(Ferramenta f) { repository.criarFerramenta(f, operacao); }
    public void editar(int id, Ferramenta f) { repository.editarFerramenta(id, f, operacao); }
    public void deletar(int id) { repository.deletarFerramenta(id, deletarResult); }
}
