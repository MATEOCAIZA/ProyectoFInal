import { ObservationRepository } from '../repositories/ObservationRepository.js';
import { ProcessRepository } from '../repositories/ProcessRepository.js';

const observationRepo = new ObservationRepository();
const processRepo = new ProcessRepository();

export class ObservationService {
  async createObservation({ process_id, title, content }, account_id) {
  const process = await processRepo.findById(process_id);
  if (!process) {
    throw new Error('Proceso no encontrado');
  }

  if (process.account_id !== account_id) {
    throw new Error('No autorizado');
  }

  return await observationRepo.create({ process_id, title, content });
}


async modifyObservation({ observation_id, title, content, account_id }) {
  // Verificamos si la observación pertenece a un proceso del usuario
  const observation = await observationRepo.findWithProcess(observation_id);

  if (!observation) {
    throw new Error('Observación no encontrada');
  }

  if (observation.process_owner !== account_id) {
    throw new Error('No autorizado para modificar esta observación');
  }

  // Si no envían el campo, mantenemos el valor anterior. Si envían null, lo seteamos como null
  const newTitle = Object.prototype.hasOwnProperty.call(arguments[0], 'title') && title !== '' ? title : observation.title;
  const newContent = Object.prototype.hasOwnProperty.call(arguments[0], 'content') && content !== '' ? content : observation.content;


  return await observationRepo.update({
    observation_id,
    title: newTitle,
    content: newContent
  });
}




async deleteObservation({ observation_id, account_id }) {
  // Traer observación con el dueño del proceso
  const observation = await observationRepo.findWithProcess(observation_id);

  if (!observation) {
    throw new Error('Observación no encontrada');
  }

  if (observation.process_owner !== account_id) {
    throw new Error('No autorizado para eliminar esta observación');
  }

  await observationRepo.delete(observation_id);
}



  async getObservationsByProcessId(process_id) {
    return await observationRepo.findByProcessId(process_id);
  }
}
