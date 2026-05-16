package com.smartbench.app.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class DateUtils {

    private static final SimpleDateFormat ISO_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault());
    private static final SimpleDateFormat ISO_FORMAT_SHORT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.getDefault());
    private static final SimpleDateFormat DISPLAY_FORMAT = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());
    private static final SimpleDateFormat DATE_ONLY = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
    private static final SimpleDateFormat TIME_ONLY = new SimpleDateFormat("HH:mm", Locale.getDefault());

    public static String formatDisplay(String isoDate) {
        if (isoDate == null) return "--";
        try {
            Date date = ISO_FORMAT.parse(isoDate);
            return DISPLAY_FORMAT.format(date);
        } catch (ParseException e) {
            try {
                Date date = ISO_FORMAT_SHORT.parse(isoDate);
                return DISPLAY_FORMAT.format(date);
            } catch (ParseException e2) {
                return isoDate;
            }
        }
    }

    public static String formatDateOnly(String isoDate) {
        if (isoDate == null) return "--";
        try {
            Date date = ISO_FORMAT.parse(isoDate);
            return DATE_ONLY.format(date);
        } catch (ParseException e) {
            return isoDate;
        }
    }

    public static String formatTimeOnly(String isoDate) {
        if (isoDate == null) return "--";
        try {
            Date date = ISO_FORMAT.parse(isoDate);
            return TIME_ONLY.format(date);
        } catch (ParseException e) {
            return isoDate;
        }
    }

    public static String formatTempoFora(Long minutos) {
        if (minutos == null) return "0 min";
        if (minutos < 60) return minutos + " min";
        long h = minutos / 60;
        long m = minutos % 60;
        if (m == 0) return h + "h";
        return h + "h " + m + "min";
    }
}
