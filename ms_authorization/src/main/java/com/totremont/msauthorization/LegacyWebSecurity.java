/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.totremont.msauthorization;

import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

/**
 *
 * @author ezequ
 */
public class LegacyWebSecurity extends WebSecurityConfigurerAdapter {

    /*
    @Override
    protected void configure(HttpSecurity http) throws Exception 
    {
        http
            .authorizeHttpRequests((authz) -> authz
                .antMatchers("/oauth/**").permitAll()
            );
    }
*/

}
