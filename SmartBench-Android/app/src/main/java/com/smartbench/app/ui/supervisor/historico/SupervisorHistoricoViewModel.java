package com.smartbench.app.ui.supervisor.historico;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.SupervisorRepository;
import java.util.List;

public class SupervisorHistoricoViewModel extends AndroidViewModel {
    private final SupervisorRepository repository;
    public final MutableLiveData<Resource<List<Transacao>>> historico = new MutableLiveData<>();

    public SupervisorHistoricoViewModel(@NonNull Application application) {
        super(application);
        repository = new SupervisorRepository(application);
    }

    public void carregar() { repository.getHistorico(historico); }
}
