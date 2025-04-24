package vngo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vngo.ultil.AccountStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountStatusDto {
	Long accountId;
	AccountStatus status;
}
