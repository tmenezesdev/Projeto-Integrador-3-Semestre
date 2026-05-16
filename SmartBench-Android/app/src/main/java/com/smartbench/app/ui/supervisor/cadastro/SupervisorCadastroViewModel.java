package com.smartbench.app.ui.supervisor.cadastro;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.request.CriarFuncionarioRequest;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.SupervisorRepository;
import java.util.Map;

public class SupervisorCadastroViewModel extends AndroidViewModel {
    private final SupervisorRepository repository;
    public final MutableLiveData<Resource<Map<String, Object>>> cadastroResult = new MutableLiveData<>();

    public SupervisorCadastroViewModel(@NonNull Application application) {
        super(application);
        repository = new SupervisorRepository(application);
    }

    public void cadastrar(CriarFuncionarioRequest req) {
        repository.criarFuncionario(req, cadastroResult);
    }
}
