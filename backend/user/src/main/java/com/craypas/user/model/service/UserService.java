package com.craypas.user.model.service;

import com.craypas.user.model.dto.RequestDto;
import com.craypas.user.model.dto.ResponseDto;

public interface UserService {
	// 회원가입
	ResponseDto.GetUser createUser(final RequestDto.CreateUser requestDto);

	// 핀번호 활성여부 조회
	Boolean isPinEnabled(final Long uid);

	// 핀번호 체크
	Boolean checkPin(final Long uid, final String pin);

	// 핀번호 수정
	void updatePin(final Long uid, final String pin);

	// 회원정보 조회
	ResponseDto.GetUser getUser(final Long uid);

	// 회원정보 수정
	ResponseDto.GetUser updateUser(final RequestDto.UpdateUser requestDto);

	// 회원 탈퇴
	void removeUser(final Long uid);

	// 회원정보 삭제
	void deleteUser(final Long uid);

	// 포인트 구매
	Integer buyPoint(final Long uid, final Integer point);

	// 포인트 사용
	Integer usePoint(final Long uid, final Integer point);

	// 포인트 환불
	Integer refundPoint(final Long uid, final Integer point);

	// 포인트 현금화 요청
	Integer encashPoint(final Long uid, final Integer point);

	// 포인트 초기화
	Integer initPoint(final Long uid, final Integer point);

	// 비밀번호 찾기
	void findPassword();

	// 비밀번호 변경
	void updatePassword();

	// 이메일 중복 확인
	Boolean checkEmail();

	// 이메일 인증 코드 발송
	void certifyEmail();

	// 프로필 사진 업로드?
	// 증명 파일 업로드?
	// 뱃지 상세 조회?
}
