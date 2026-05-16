package com.smartbench.app.ui.mecanico.dashboard;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Transacao;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.MecanicoRepository;
import java.util.List;

public class MecanicoDashboardViewModel extends AndroidViewModel {
    private final MecanicoRepository repository;
    public final MutableLiveData<Resource<List<Transacao>>> retiradas = new MutableLiveData<>();

    public MecanicoDashboardViewModel(@NonNull Application application) {
        super(application);
        repository = new MecanicoRepository(application);
    }

    public void carregar() { repository.getMinhasRetiradas(retiradas); }
}
