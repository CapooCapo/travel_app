import { useSchedule } from "../../../context/ScheduleContext";
import { Alert } from "react-native";

export const useScheduleLogic = () => {
  const { deleteSchedule, addSchedule } = useSchedule();

  const handleAdd = async (attractionId: number, date: Date, notes: string) => {
    try {
      await addSchedule({
        locationId: attractionId,
        scheduledDate: date.toISOString().split("T")[0],
        notes,
      });
      return true;
    } catch (err) {
      Alert.alert("Error", "Could not add schedule");
      return false;
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to remove this schedule?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deleteSchedule(id) 
        }
      ]
    );
  };

  return {
    handleDelete,
    handleAdd,
  };
};
