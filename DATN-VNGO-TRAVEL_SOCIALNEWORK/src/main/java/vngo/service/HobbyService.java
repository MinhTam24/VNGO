package vngo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import vngo.dto.HobbyDto;

@Service
public interface HobbyService {
	List<HobbyDto> getAll();
	List<HobbyDto> getHobbiesByAccountId(Long id);
}
