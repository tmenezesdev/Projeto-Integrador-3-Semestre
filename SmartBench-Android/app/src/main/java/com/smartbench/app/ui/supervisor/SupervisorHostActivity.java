package com.smartbench.app.ui.supervisor;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;
import androidx.navigation.NavController;
import androidx.navigation.fragment.NavHostFragment;
import androidx.navigation.ui.NavigationUI;

import com.smartbench.app.R;
import com.smartbench.app.data.local.SessionManager;
import com.smartbench.app.databinding.ActivitySupervisorHostBinding;
import com.smartbench.app.ui.auth.LoginActivity;

public class SupervisorHostActivity extends AppCompatActivity {

    private ActivitySupervisorHostBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySupervisorHostBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        NavHostFragment navHostFragment = (NavHostFragment) getSupportFragmentManager()
                .findFragmentById(R.id.navHostFragment);

        if (navHostFragment == null) return;

        NavController navController = navHostFragment.getNavController();
        NavigationUI.setupWithNavController(binding.bottomNavigationView, navController);

        binding.fabChat.setOnClickListener(v -> {
            if (navController.getCurrentDestination() != null
                    && navController.getCurrentDestination().getId() != R.id.chatFragment) {
                navController.navigate(R.id.chatFragment);
            }
        });

        navController.addOnDestinationChangedListener((controller, destination, arguments) -> {
            if (destination.getId() == R.id.chatFragment) {
                binding.fabChat.hide();
                binding.bottomNavigationView.setVisibility(View.GONE);
            } else {
                binding.fabChat.show();
                binding.bottomNavigationView.setVisibility(View.VISIBLE);
            }
        });
    }

    public void logout() {
        SessionManager.getInstance(this).clearSession();
        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
    }
}
