package com.smartbench.app.ui.supervisor.visaogeral;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.response.DashboardSupervisorResponse;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.SupervisorRepository;
import java.util.List;

public class SupervisorVisaoGeralViewModel extends AndroidViewModel {
    private final SupervisorRepository repository;
    public final MutableLiveData<Resource<DashboardSupervisorResponse>> visaoGeral = new MutableLiveData<>();
    public final MutableLiveData<Resource<List<FluxoPonto>>> fluxo = new MutableLiveData<>();

    public SupervisorVisaoGeralViewModel(@NonNull Application application) {
        super(application);
        repository = new SupervisorRepository(application);
    }

    public void carregar() { repository.getVisaoGeral(visaoGeral); }
    public void carregarFluxo(int dias) { repository.getFluxo(dias, fluxo); }
}
