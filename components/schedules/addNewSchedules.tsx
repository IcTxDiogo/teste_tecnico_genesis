import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { Schedule } from "./schedules";
import { startHour, finishHour } from "./schedules";

/*placeholders para o formulário*/
export const placeholders: Schedule = {
  name: "Nome do paciente",
  cpf: "Cpf do paciente",
  cartao_sus: "Cartão do SUS do paciente",
  motivo_atendimento: "Motivo do atendimento",
  data_atendimento: "Data do atendimento",
  urgencia_atendimento: "Urgência do atendimento",
  medico_atendente: "Nome do médico atendente",
  recepcionista: "Nome da recepcionista",
};

interface addNewSchedulesProps {
  manageSchedules: (schedule: Schedule, isEdit?: true) => boolean;
  editSchedule: Schedule | null;
}

export default function AddNewSchedules({
  manageSchedules,
  editSchedule,
}: addNewSchedulesProps) {
  /*hook do react-hook-form para controlar o formulário*/
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Schedule>();

  /*se o agendamento a ser editado existir, preenche os campos do formulário com os dados do agendamento*/
  useEffect(() => {
    if (editSchedule) {
      Object.keys(editSchedule).forEach((key) => {
        setValue(key as keyof Schedule, editSchedule[key as keyof Schedule]);
      });
    }
  }, [editSchedule, setValue]);

  /*função que controla o submit do formulário, caso o horário não esteja disponível, retorna um erro que sera mostrado no próprio formulário usando o setError*/
  function onSubmit(data: Schedule) {
    let result;
    if (validateAge(data)) {
      if (editSchedule) result = manageSchedules(data, true);
      else result = manageSchedules(data);
      if (!result) {
        setError("data_atendimento", {
          type: "validate",
          message: "Horário já está ocupado",
        });
      }
    } else
      setError("data_atendimento", {
        type: "validate",
        message: "o Horário deve ser entre as 8 e 18 horas",
      });
  }

  /*função que valida se o horário está entre 8 e 18 horas, usando as outros duas variáveis do negocio definidas no arquivo principal*/
  const validateAge = (data: Schedule) => {
    const value = parseInt(data.data_atendimento);
    if (value < startHour || value >= finishHour) {
      return false;
    }
    return true;
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-2 border-2 p-4 rounded-xl w-full"
      >
        {/* gera o array de key da variável e passa por todas usando o map */}
        {Object.keys(placeholders).map((item) => (
          <div
            key={item}
            className="flex flex-col items-center justify-center w-full h-16"
          >
            {/* gera o label do formulário usando o item do map e o placeholder do item*/}
            <input
              {...register(item as keyof Schedule, { required: true })}
              className="w-full p-2 rounded-xl bg-gray-600"
              placeholder={placeholders[item as keyof Schedule]}
            />
            {/* caso o item seja data_atendimento, mostra o erro de validação caso seja definido com serError*/}
            {item === "data_atendimento" &&
              errors.data_atendimento?.message && (
                <p className="text-red-500">
                  {errors.data_atendimento?.message}
                </p>
              )}
          </div>
        ))}
        <button
          className="p-3 rounded-xl bg-gray-600 m-2 hover:bg-gray-500"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
