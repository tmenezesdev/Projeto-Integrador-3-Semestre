package com.smartbench.app.ui.auth;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.smartbench.app.data.model.response.LoginResponse;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.AuthRepository;

public class LoginViewModel extends AndroidViewModel {

    private final AuthRepository repository;
    public final MutableLiveData<Resource<LoginResponse>> loginResult = new MutableLiveData<>();

    public LoginViewModel(@NonNull Application application) {
        super(application);
        repository = new AuthRepository(application);
    }

    public void login(String email, String senha) {
        repository.login(email, senha, loginResult);
    }
}
