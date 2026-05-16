package com.smartbench.app.ui.admin.configuracoes;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.ConfiguracaoSistema;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;

public class AdminConfiguracoesViewModel extends AndroidViewModel {
    private final AdminRepository repository;
    public final MutableLiveData<Resource<ConfiguracaoSistema>> config = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> salvarResult = new MutableLiveData<>();

    public AdminConfiguracoesViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregar() { repository.getConfiguracoes(config); }
    public void salvar(ConfiguracaoSistema c) { repository.salvarConfiguracoes(c, salvarResult); }
}
