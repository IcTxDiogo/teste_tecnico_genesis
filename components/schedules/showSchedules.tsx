import { AiFillEdit } from "react-icons/ai";

import { Schedule } from "./schedules";
import { iconSize } from "./schedules";
import { placeholders } from "./addNewSchedules";

interface showSchedulesProps {
  schedules: Schedule[];
  editItem: (schedule: Schedule) => void;
}

const mensagem = "Não há agendamentos";

export default function ShowSchedules({
  schedules,
  editItem,
}: showSchedulesProps) {
  return (
    <>
      <div className="w-full p-4 flex flex-col gap-4">
        {/* verifica se exite ao menos um item para ser exibido, se nnao mostra uma mensagem */}
        {schedules.length > 0 ? (
          /* percorre o array de agendamentos */
          schedules.map((schedule) => (
            <div
              key={schedule.cpf}
              className="p-3 rounded-xl border-2 flex justify-between "
            >
              <div>
                {/* obtém o array de keys do agendamento e usa os placeholders para uma visão mais intuitiva, ao invés dos nomes das key diretamente */}
                {Object.keys(schedule).map((item) => (
                  <div key={item} className="">
                    <div className="text-white pb-1">
                      <h3 className="text-xl font-bold">
                        {/* posiciona o placeholder para visualizar o que é esse item */}
                        {placeholders[item as keyof Schedule]}
                      </h3>
                      <div className="pl-2 flex max-w-full">
                        {/* mostra o valor da key */}
                        {schedule[item as keyof Schedule]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* botão para editar o agendamento */}
              <div className="flex items-center">
                <button
                  className="p-4 rounded-xl bg-gray-600 hover:bg-gray-500"
                  onClick={() => editItem(schedule)}
                >
                  <AiFillEdit size={iconSize} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">{mensagem}</div>
        )}
      </div>
    </>
  );
}
