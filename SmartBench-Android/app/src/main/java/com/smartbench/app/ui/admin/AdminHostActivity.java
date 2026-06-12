package com.smartbench.app.ui.admin;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;

import com.smartbench.app.R;
import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.databinding.ActivityAdminHostBinding;
import com.smartbench.app.ui.auth.LoginActivity;
import com.smartbench.app.utils.InsetsUtils;

public class AdminHostActivity extends AppCompatActivity {

    private ActivityAdminHostBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        InsetsUtils.setupEdgeToEdge(this);
        binding = ActivityAdminHostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Edge-to-edge: empurra o conteúdo para baixo da status bar e a bottom
        // nav para cima da barra de navegação do sistema.
        InsetsUtils.applyAll(binding.navHostFragment);
        InsetsUtils.applyBottom(binding.bottomNavigationView);

        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.navHostFragment);

        if (navHostFragment == null) return;

        NavController navController = navHostFragment.getNavController();
        NavigationUI.setupWithNavController(binding.bottomNavigationView, navController);
    }

    public void logout() {
        SessionManager.getInstance(this).clearSession();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }
}
