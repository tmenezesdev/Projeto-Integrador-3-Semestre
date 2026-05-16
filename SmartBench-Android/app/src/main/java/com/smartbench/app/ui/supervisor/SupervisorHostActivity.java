package com.smartbench.app.ui.supervisor;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;

import com.smartbench.app.R;
import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.databinding.ActivityHostBinding;
import com.smartbench.app.ui.auth.LoginActivity;

public class SupervisorHostActivity extends AppCompatActivity {

    private ActivityHostBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityHostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.navHostFragment);

        if (navHostFragment != null) {
            NavController navController = navHostFragment.getNavController();
            navController.setGraph(R.navigation.nav_supervisor);
            binding.bottomNavigationView.inflateMenu(R.menu.menu_supervisor_bottom_nav);
            NavigationUI.setupWithNavController(binding.bottomNavigationView, navController);
        }
    }

    public void logout() {
        SessionManager.getInstance(this).clearSession();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }
}
