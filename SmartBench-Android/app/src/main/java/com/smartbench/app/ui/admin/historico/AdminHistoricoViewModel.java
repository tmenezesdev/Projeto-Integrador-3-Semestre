package com.smartbench.app.ui.admin.historico;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;
import java.util.List;

public class AdminHistoricoViewModel extends AndroidViewModel {
    private final AdminRepository repository;
    public final MutableLiveData<Resource<List<Transacao>>> historico = new MutableLiveData<>();

    public AdminHistoricoViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregar() { repository.getHistorico(historico); }
}
