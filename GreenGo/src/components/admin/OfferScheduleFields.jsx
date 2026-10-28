
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatOfferDateBoth } from "../../utils/dateFormatter";
import { formatOfferTime } from "../../utils/timeFormattter";

// Convert either 24-hour or 12-hour time to the database-friendly HH:MM format.
const to24Hour = (value) => {
  if (!value) return "";

  const input = String(value).trim();

  // Already in 24-hour HH:MM format.
  const twentyFourHour = input.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHour) {
    return `${String(Number(twentyFourHour[1])).padStart(2, "0")}:${twentyFourHour[2]}`;
  }

  // 12-hour format, with or without a space before AM/PM.
  const twelveHour = input.match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i
  );

  if (!twelveHour) return "";

  let hours = Number(twelveHour[1]);
  const minutes = twelveHour[2];
  const period = twelveHour[3].toUpperCase();

  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;

  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

// Convert stored HH:MM to a readable 12-hour time.
const to12Hour = (value) => {
  const normalized = to24Hour(value);
  if (!normalized) return "";

  const [hoursText, minutes] = normalized.split(":");
  const hours = Number(hoursText);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  return `${String(displayHours).padStart(2, "0")}:${minutes} ${period}`;
};

const parseDate = (value) => {
  if (!value) return new Date();

  const [year, month, day] = value.split("-").map(Number);

  return new Date(
    year || 2026,
    (month || 1) - 1,
    day || 1,
    12,
    0,
    0
  );
};

const dateString = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const timeString = (date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const ethiopianDateToGregorian = (value) => {
  const match = String(value || "")
    .trim()
    .match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    year < 1 ||
    month < 1 ||
    month > 13 ||
    day < 1 ||
    day > (month === 13 ? 6 : 30)
  ) {
    return "";
  }

  // Ethiopian 2016-01-01 corresponds to Gregorian 2023-09-12.
  const days =
    365 * (year - 2016) +
    Math.floor(year / 4) -
    Math.floor(2016 / 4) +
    (month - 1) * 30 +
    day -
    1;

  const date = new Date(2023, 8, 12 + days, 12, 0, 0);

  return dateString(date);
};

export default function OfferScheduleFields({
  startDate,
  endDate,
  startTime,
  endTime,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime,
}) {
  const [dateEntry, setDateEntry] = useState("pick");
  const [timeEntry, setTimeEntry] = useState("pick");
  const [typedCalendar, setTypedCalendar] = useState("gc");

  const [typedDates, setTypedDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [typedTimes, setTypedTimes] = useState({
    startTime: to12Hour(startTime),
    endTime: to12Hour(endTime),
  });

  const [activePicker, setActivePicker] = useState(null);
  const [pickerDate, setPickerDate] = useState(new Date());

  // Normalize existing values such as "04:00 AM" to "04:00".
  // This keeps existing validation and database storage compatible.
  useEffect(() => {
    const normalizedStart = to24Hour(startTime);
    const normalizedEnd = to24Hour(endTime);

    if (normalizedStart && normalizedStart !== startTime) {
      setStartTime(normalizedStart);
    }

    if (normalizedEnd && normalizedEnd !== endTime) {
      setEndTime(normalizedEnd);
    }
  }, [startTime, endTime, setStartTime, setEndTime]);

  const openPicker = (kind, value) => {
    const isTime = kind.toLowerCase().includes("time");
    const date = isTime ? new Date() : parseDate(value);

    if (isTime && value) {
      const normalized = to24Hour(value);

      if (normalized) {
        const [hours, minutes] = normalized.split(":").map(Number);
        date.setHours(hours, minutes, 0, 0);
      }
    }

    setPickerDate(date);
    setActivePicker(kind);
  };

  const onPicked = (event, selected) => {
    if (Platform.OS !== "ios") {
      setActivePicker(null);
    }

    if (!selected || event?.type === "dismissed") return;

    if (activePicker === "startDate") {
      setStartDate(dateString(selected));
    }

    if (activePicker === "endDate") {
      setEndDate(dateString(selected));
    }

    if (activePicker === "startTime") {
      setStartTime(timeString(selected));
    }

    if (activePicker === "endTime") {
      setEndTime(timeString(selected));
    }
  };

  const choice = (label, selected, onPress) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      style={[s.choice, selected && s.selected]}
    >
      <Text style={[s.choiceText, selected && s.selectedText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const dateField = (label, value, setter, kind) => (
    <View style={s.field}>
      <Text style={s.label}>{label}</Text>

      {dateEntry === "type" ? (
        <TextInput
          style={s.input}
          value={typedCalendar === "ec" ? typedDates[kind] : value || ""}
          onChangeText={(input) => {
            if (typedCalendar === "ec") {
              setTypedDates((previous) => ({
                ...previous,
                [kind]: input,
              }));

              const converted = ethiopianDateToGregorian(input);

              if (converted) {
                setter(converted);
              } else if (!input) {
                setter("");
              }
            } else {
              setter(input);
            }
          }}
          placeholder={
            typedCalendar === "ec"
              ? "YYYY-MM-DD (E.C.)"
              : "YYYY-MM-DD (G.C.)"
          }
          placeholderTextColor="#777"
          keyboardType="numbers-and-punctuation"
        />
      ) : Platform.OS === "web" ? (
        <input
          aria-label={label}
          type="date"
          value={value || ""}
          onChange={(event) => setter(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            backgroundColor: "#111",
            color: "#fff",
            border: "1px solid #393939",
            borderRadius: 10,
            padding: 13,
            fontSize: 15,
          }}
        />
      ) : (
        <TouchableOpacity
          style={s.pickButton}
          onPress={() => openPicker(kind, value)}
        >
          <Text style={s.pickText}>
            {value || "Choose date…"} ▾
          </Text>
        </TouchableOpacity>
      )}

      {value ? (
        <Text style={s.preview}>{formatOfferDateBoth(value)}</Text>
      ) : null}
    </View>
  );

  const timeField = (label, value, setter, kind) => {
    const typedValue = typedTimes[kind] || "";

    return (
      <View style={s.field}>
        <Text style={s.label}>{label}</Text>

        {timeEntry === "type" ? (
          <TextInput
            style={s.input}
            value={typedValue}
            onChangeText={(input) => {
              // Allow digits, colon, spaces and AM/PM letters.
              const cleaned = input
                .replace(/[^0-9:aApPmM\s]/g, "")
                .slice(0, 8);

              setTypedTimes((previous) => ({
                ...previous,
                [kind]: cleaned,
              }));

              const normalized = to24Hour(cleaned);

              // Update the saved value when the typed time is valid.
              if (normalized) {
                setter(normalized);
              } else if (!cleaned.trim()) {
                setter("");
              }
            }}
            placeholder="04:00 AM"
            placeholderTextColor="#777"
            keyboardType="numbers-and-punctuation"
            autoCapitalize="characters"
          />
        ) : Platform.OS === "web" ? (
          <input
            aria-label={label}
            type="time"
            value={to24Hour(value)}
            onChange={(event) => setter(event.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              backgroundColor: "#111",
              color: "#fff",
              border: "1px solid #393939",
              borderRadius: 10,
              padding: 13,
              fontSize: 15,
            }}
          />
        ) : (
          <TouchableOpacity
            style={s.pickButton}
            onPress={() => openPicker(kind, value)}
          >
            <Text style={s.pickText}>
              {value ? to12Hour(value) : "Choose time…"} ▾
            </Text>
          </TouchableOpacity>
        )}

        {value && timeEntry === "type" ? (
          <Text style={s.preview}>
            {to12Hour(value)}
          </Text>
        ) : null}
      </View>
    );
  };

  return (
    <View style={s.container}>
      <Text style={s.heading}>OFFER SCHEDULE</Text>

      <Text style={s.helper}>
        Choose Pick or Type. Choose Gregorian or Ethiopian calendar when
        typing dates. Dates are stored consistently and shown to customers
        in both G.C. (foreign calendar) and E.C. (Ethiopian calendar).
        Times use Ethiopia local time (LT / EAT, UTC+3).
      </Text>

      <Text style={s.label}>Date entry</Text>
      <View style={s.row}>
        {choice("Pick date", dateEntry === "pick", () =>
          setDateEntry("pick")
        )}
        {choice("Type date", dateEntry === "type", () =>
          setDateEntry("type")
        )}
      </View>

      {dateEntry === "type" ? (
        <>
          <Text style={s.label}>Calendar for typed dates</Text>

          <View style={s.row}>
            {choice("Gregorian (G.C.)", typedCalendar === "gc", () =>
              setTypedCalendar("gc")
            )}
            {choice("Ethiopian (E.C.)", typedCalendar === "ec", () =>
              setTypedCalendar("ec")
            )}
          </View>

          <Text style={s.helper}>
            When typing an E.C. date, enter year-month-day, for example
            2018-02-10. The date is converted to G.C. for saving and shown
            in both calendars.
          </Text>
        </>
      ) : null}

      <Text style={s.label}>Time entry</Text>

      <View style={s.row}>
        {choice("Pick time", timeEntry === "pick", () =>
          setTimeEntry("pick")
        )}
        {choice("Type time", timeEntry === "type", () =>
          setTimeEntry("type")
        )}
      </View>

      {timeEntry === "type" ? (
        <Text style={s.helper}>
          Enter a 12-hour time, including AM or PM, for example 04:00 AM
          or 12:30 PM.
        </Text>
      ) : null}

      <View style={s.row}>
        {dateField("Start date", startDate, setStartDate, "startDate")}
        {dateField("End date", endDate, setEndDate, "endDate")}
      </View>

      <View style={s.row}>
        {timeField("Start time", startTime, setStartTime, "startTime")}
        {timeField("End time", endTime, setEndTime, "endTime")}
      </View>

      {activePicker && Platform.OS !== "web" ? (
        <DateTimePicker
          value={pickerDate}
          mode={
            activePicker.toLowerCase().includes("date") ? "date" : "time"
          }
          display="default"
          onChange={onPicked}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#0c0c0c",
    borderColor: "#292929",
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginVertical: 14,
    gap: 8,
  },
  heading: {
    color: "#f4b400",
    fontSize: 16,
    fontWeight: "900",
  },
  helper: {
    color: "#aaa",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 7,
  },
  label: {
    color: "#ddd",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  choice: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#171717",
  },
  selected: {
    borderColor: "#f4b400",
    backgroundColor: "#302707",
  },
  choiceText: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "700",
  },
  selectedText: {
    color: "#f4b400",
  },
  field: {
    flex: 1,
    minWidth: 0,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#393939",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  pickButton: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#393939",
    borderRadius: 10,
    padding: 13,
  },
  pickText: {
    color: "#fff",
    fontSize: 14,
  },
  preview: {
    color: "#f4b400",
    fontSize: 11,
    marginTop: 5,
  },
});
