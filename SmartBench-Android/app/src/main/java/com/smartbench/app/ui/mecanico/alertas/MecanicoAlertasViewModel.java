package com.smartbench.app.ui.mecanico.alertas;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.MecanicoRepository;
import java.util.List;

public class MecanicoAlertasViewModel extends AndroidViewModel {
    private final MecanicoRepository repository;
    public final MutableLiveData<Resource<List<Alerta>>> alertas = new MutableLiveData<>();

    public MecanicoAlertasViewModel(@NonNull Application application) {
        super(application);
        repository = new MecanicoRepository(application);
    }

    public void carregar() { repository.getAlertas(alertas); }
}
