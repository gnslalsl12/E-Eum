package com.craypas.bottle.model.dto.response;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.craypas.bottle.model.entity.ResBottle;
import com.querydsl.core.annotations.QueryProjection;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@Builder
@ToString
public class CreatedResBottleDto {
	private long id;
	private long userReqBottleId;
	private String content;
	private String ttsPath;
	private String regTime;
	private int status;

	@QueryProjection
	public CreatedResBottleDto(long id, long userReqBottleId, String content, String ttsPath, String regTime, int status) {
		this.id = id;
		this.userReqBottleId = userReqBottleId;
		this.content = content;
		this.ttsPath = ttsPath;
		this.regTime = regTime;
		this.status = status;
	}

	public ResBottle toEntity() throws ParseException {
		return ResBottle.builder()
			.id(id)
			.userReqBottleId(userReqBottleId)
			.content(content)
			.ttsPath(ttsPath)
			.regTime(dateConverter(regTime))
			.status(status)
			.build();
	}

	public Date dateConverter(String input) throws ParseException {
		SimpleDateFormat foramatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = foramatter.parse(input);
		return date;
	}
}
