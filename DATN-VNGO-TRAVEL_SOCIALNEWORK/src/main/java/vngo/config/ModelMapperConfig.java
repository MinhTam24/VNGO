package vngo.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import vngo.dto.AccountDto;
import vngo.dto.LocationDetailDto;
import vngo.entity.Account;
import vngo.entity.LocationDetail;
import vngo.ultil.ConstUltil;

@Configuration
public class ModelMapperConfig {

	@Bean
	public ModelMapper modelMapper() {
		ModelMapper modelMapper = new ModelMapper();
		modelMapper.getConfiguration().setAmbiguityIgnored(true); // Bỏ qua sự mơ hồ trong ánh xạ

		// Ánh xạ Account thành AccountDto
		modelMapper.typeMap(Account.class, AccountDto.class)
				.addMappings(mapper -> mapper.map(
						src -> src.getBirthday() != null ? src.getBirthday().format(ConstUltil.DATE_FORMATTER) : null,
						AccountDto::setBirthday));

		// Ánh xạ AccountDto thành Account
		modelMapper.typeMap(AccountDto.class, Account.class).addMappings(mapper -> mapper.map(
				src -> src.getBirthday() != null ? LocalDate.parse(src.getBirthday(), ConstUltil.DATE_FORMATTER) : null,
				Account::setBirthday));

		return modelMapper;

	}


}
