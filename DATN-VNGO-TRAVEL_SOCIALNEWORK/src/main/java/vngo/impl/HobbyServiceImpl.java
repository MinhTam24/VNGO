package vngo.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vngo.dto.HobbyDto;
import vngo.entity.Account;
import vngo.entity.Hobby;
import vngo.exception.ResourceNotFoundException;
import vngo.repository.AccountRepository;
import vngo.repository.HobbyRepository;
import vngo.service.HobbyService;

@Service
public class HobbyServiceImpl implements HobbyService {

	@Autowired
	HobbyRepository hobbyRepository;

	@Autowired
	AccountRepository accountRepository;

	@Autowired
	ModelMapper modelMapper;

	@Override
	public List<HobbyDto> getAll() {
		List<Hobby> listHobby = hobbyRepository.findAll();
		List<HobbyDto> listHobbyDto = listHobby.stream()
				.map(hobby -> HobbyDto.builder().id(hobby.getId()).name(hobby.getName()).build()).toList();
		return listHobbyDto;
	}

	@Override
	public List<HobbyDto> getHobbiesByAccountId(Long id) {
		Account account = accountRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản" + id));

		// Lấy danh sách hobbies của tài khoản
		List<Hobby> hobbies = account.getHobbys();
		if (hobbies == null || hobbies.isEmpty()) {
			return List.of();
		}

		// Chuyển đổi từ Hobby entity sang HobbyDto
		return hobbies.stream().map(hobby -> modelMapper.map(hobby, HobbyDto.class)).collect(Collectors.toList());
	}

}
