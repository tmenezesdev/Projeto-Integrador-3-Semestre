package com.smartbench.app.ui.admin.alertas;

import android.app.Application;
import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;
import com.smartbench.app.data.model.entity.Alerta;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;
import java.util.List;

public class AdminAlertasViewModel extends AndroidViewModel {
    private final AdminRepository repository;
    public final MutableLiveData<Resource<List<Alerta>>> alertas = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> resolverResult = new MutableLiveData<>();

    public AdminAlertasViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregar() { repository.getAlertas(alertas); }
    public void resolver(int id) { repository.resolverAlerta(id, resolverResult); }
}
