package com.codestates.stackoverflow.member.service.impl;

import com.codestates.stackoverflow.auth.utils.CustomAuthorityUtils;
import com.codestates.stackoverflow.member.entity.Member;
import com.codestates.stackoverflow.member.repository.MemberRepository;
import com.codestates.stackoverflow.member.service.MemberService;
import net.bytebuddy.asm.Advice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Transactional
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomAuthorityUtils authorityUtils;

    public MemberServiceImpl(MemberRepository memberRepository, PasswordEncoder passwordEncoder, CustomAuthorityUtils authorityUtils) {
        this.memberRepository = memberRepository;
        this.passwordEncoder = passwordEncoder;
        this.authorityUtils = authorityUtils;
    }

    @Override
    public Member createMember(Member member) {
        verifyExistsEmail(member.getEmail());
        verifyExistsName(member.getName());

        String encodedPassword = passwordEncoder.encode(member.getPassword());
        member.setPassword(encodedPassword);

        List<String> roles = authorityUtils.createRole(member.getEmail());
        member.setRoles(roles);
        Member createdMember = memberRepository.save(member);

        return createdMember;
    }

//    @Override
//    public Member loadMember (Member member) {
//        boolean isVerified = verifyPassword(member);
//
//        if (!isVerified) {
//            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
//        }
//
//        Optional<Member> optionalMember = memberRepository.findByEmailAndPassword(member.getEmail(),
//                member.getPassword());
//
//        Member findMember = optionalMember.orElseThrow(
//                () -> new RuntimeException("비밀번호 또는 아이디를 확인해주세요."));
//
//        findMember.setAuth(true);
//
//        return memberRepository.save(findMember);
//    }
//
//    @Override
//    public Member logoutMember(long memberId) {
//
//        Member member = findVerifiedMember(memberId);
//
//        if (!member.isAuth()) {
//            new RuntimeException("이미 로그아웃 상태입니다.");
//        }
//        member.setAccessedAt(LocalDateTime.now());
//        member.setAuth(false);
//
//        return memberRepository.save(member);
//    }
//
//    @Override
//    public void deleteMember(long memberId) {
//        Member findMember = findVerifiedMember(memberId);
//
//        memberRepository.delete(findMember);
//    }

    private void verifyExistsEmail(String email) {
        boolean isExistsEmail = memberRepository.existsByEmail(email);

        if(isExistsEmail)
            throw new RuntimeException("이미 존재하는 이메일입니다");
    }

    private void verifyExistsName(String name) {
        boolean isExistsName = memberRepository.existsByName(name);

        if(isExistsName)
            throw new RuntimeException("이미 존재하는 이름입니다");
    }

    private Member findVerifiedMember(long memberId) {
        Optional<Member> optionalMember = memberRepository.findById(memberId);

        Member findMember = optionalMember
                .orElseThrow(() -> new RuntimeException("존재하는 회원이 아닙니다."));

        return findMember;
    }

    private boolean verifyPassword(Member member) {
        Optional<Member> optionalMember = memberRepository.findByEmail(member.getEmail());

        Member findMember = optionalMember
                .orElseThrow(() -> new RuntimeException("존재하는 회원이 아닙니다."));

        String rowPassword = member.getPassword();
        String encodedPassword = findMember.getPassword();

//        if (passwordEncoder.matches(rowPassword, encodedPassword)) {
//            return true;
//        } else {
//            return false;
//        }
        return true;
    }
}
