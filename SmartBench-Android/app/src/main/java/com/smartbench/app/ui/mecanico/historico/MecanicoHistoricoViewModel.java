package com.smartbench.app.ui.mecanico.historico;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.MecanicoRepository;
import java.util.List;

public class MecanicoHistoricoViewModel extends AndroidViewModel {
    private final MecanicoRepository repository;
    public final MutableLiveData<Resource<List<Transacao>>> historico = new MutableLiveData<>();

    public MecanicoHistoricoViewModel(@NonNull Application application) {
        super(application);
        repository = new MecanicoRepository(application);
    }

    public void carregar() { repository.getHistorico(historico); }
}
