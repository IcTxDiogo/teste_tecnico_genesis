"use client";

import { useState } from "react";
import { AiFillFileAdd, AiFillCloseCircle } from "react-icons/ai";

import AddNewSchedules from "./addNewSchedules";
import ShowSchedules from "./showSchedules";

/* como nao foi definido usei somente o horário das 8hrs a 18hrs, caso seja necessário a data como exemplo 10/05/2023 */
/* o ideal seria adicionar um novo campo que controle a data, assim nao alteraria a regra de negocio */
/* caso a consulta nao tenha duração de uma hora, poderia aumentar o valor de schedulePerHour para permitir mais consultas no mesmo horário */

/*rules of business*/
const schedulePerHour = 1;
export const startHour = 8;
export const finishHour = 18;
export const iconSize = 30;

export interface Schedule {
  name: string;
  cpf: string;
  cartao_sus: string;
  motivo_atendimento: string;
  data_atendimento: string;
  urgencia_atendimento: string;
  medico_atendente: string;
  recepcionista: string;
}

export default function Schedules() {
  /*variáveis de estado que serão usadas para controlar o fluxo do formulário*/
  const [toggleForm, setToggleForm] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);

  /* função que controla a adição ou edição de um novo agendamento, ela é passado ao formulário que caso seja retornado false, o erro aparece no formulário */
  function manageSchedules(schedule: Schedule, isEdit?: true) {
    if (isEdit) {
      const result = schedules.filter((item) => {
        return item.cpf !== schedule.cpf;
      });
      if (verifyUsedHour(schedule, isEdit)) {
        setSchedules([...result, schedule]);
        setEditSchedule(null);
        setToggleForm(!toggleForm);
        return true;
      }
      return false;
    }
    if (verifyUsedHour(schedule)) {
      setSchedules([...schedules, schedule]);
      setToggleForm(!toggleForm);
      return true;
    }
    return false;
  }

  /*função para verifica se o horário está disponível para o agendamento de acordo com o numero de horários disponíveis*/
  function verifyUsedHour(schedule: Schedule, edit?: true) {
    if (edit) {
      const result = schedules.filter((scheduleAtual) => {
        return (
          scheduleAtual.data_atendimento === schedule.data_atendimento &&
          scheduleAtual.cpf !== schedule.cpf
        );
      });
      return result.length < schedulePerHour;
    }
    const result = schedules.filter((scheduleAtual) => {
      return scheduleAtual.data_atendimento === schedule.data_atendimento;
    });
    return result.length < schedulePerHour;
  }

  /*função que altera o fluxo do formulário para edição */
  function editItem(schedule: Schedule) {
    setEditSchedule(schedule);
    setToggleForm(!toggleForm);
  }

  /*variável com os agendamentos ordenados por data*/
  const orderedSchedules = schedules.sort((a, b) => {
    return parseInt(a.data_atendimento) - parseInt(b.data_atendimento);
  });

  return (
    <>
      <div className="flex flex-col items-center text-white max-w-xl  w-full">
        <div>
          {/* botão que gerencia o formulário */}
          <button
            className="p-3 rounded-xl bg-gray-600 m-2 hover:bg-gray-500"
            onClick={() => setToggleForm(!toggleForm)}
          >
            {/* ícones do React icons para facilitar a visualização */}
            {toggleForm ? (
              <AiFillCloseCircle size={iconSize} />
            ) : (
              <AiFillFileAdd size={iconSize} />
            )}
          </button>
        </div>
        {/*mostra o formulário ou a lista de agendamentos de acordo com o estado da variável */}
        {toggleForm ? (
          <AddNewSchedules
            manageSchedules={manageSchedules}
            editSchedule={editSchedule}
          />
        ) : (
          <ShowSchedules schedules={orderedSchedules} editItem={editItem} />
        )}
      </div>
    </>
  );
}
