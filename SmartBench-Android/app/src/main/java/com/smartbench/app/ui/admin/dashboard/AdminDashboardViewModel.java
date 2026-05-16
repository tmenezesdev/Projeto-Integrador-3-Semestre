package com.smartbench.app.ui.admin.dashboard;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.smartbench.app.data.model.entity.FluxoPonto;
import com.smartbench.app.data.model.response.DashboardAdminResponse;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AdminRepository;

import java.util.List;

public class AdminDashboardViewModel extends AndroidViewModel {

    private final AdminRepository repository;
    public final MutableLiveData<Resource<DashboardAdminResponse>> dashboard = new MutableLiveData<>();
    public final MutableLiveData<Resource<List<FluxoPonto>>> fluxo = new MutableLiveData<>();

    public AdminDashboardViewModel(@NonNull Application application) {
        super(application);
        repository = new AdminRepository(application);
    }

    public void carregarDashboard() {
        repository.getDashboard(dashboard);
    }

    public void carregarFluxo(int dias) {
        repository.getFluxo(dias, fluxo);
    }
}
