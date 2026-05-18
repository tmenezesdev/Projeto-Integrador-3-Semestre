package com.smartbench.app.ui.chat;

import android.app.Application;
import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.MutableLiveData;

import com.smartbench.app.data.model.entity.ChatMensagem;
import com.smartbench.app.data.model.response.ChatStatus;
import com.smartbench.app.data.model.response.Resource;
import com.smartbench.app.data.repository.ChatRepository;

import java.util.List;

public class ChatViewModel extends AndroidViewModel {

    private final ChatRepository repository;
    public final MutableLiveData<ChatStatus> status = new MutableLiveData<>();
    public final MutableLiveData<Resource<List<ChatMensagem>>> mensagens = new MutableLiveData<>();
    public final MutableLiveData<Resource<Void>> envioResult = new MutableLiveData<>();

    private final Handler pollingHandler = new Handler(Looper.getMainLooper());
    private final Runnable pollingRunnable = new Runnable() {
        @Override
        public void run() {
            repository.getMensagens(mensagens);
            pollingHandler.postDelayed(this, 5_000);
        }
    };

    public ChatViewModel(@NonNull Application application) {
        super(application);
        repository = new ChatRepository(application);
    }

    public void iniciar() {
        repository.getStatus(status);
        repository.getMensagens(mensagens);
        pollingHandler.postDelayed(pollingRunnable, 5_000);
    }

    public void pararPolling() {
        pollingHandler.removeCallbacks(pollingRunnable);
    }

    public void retomarPolling() {
        pollingHandler.removeCallbacks(pollingRunnable);
        pollingHandler.postDelayed(pollingRunnable, 5_000);
    }

    public void enviar(String conteudo) {
        repository.enviarMensagem(conteudo, envioResult);
    }

    public void recarregar() {
        repository.getMensagens(mensagens);
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        pararPolling();
    }
}
