/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.totremont.msauthorization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 *
 * @author ezequ
 */
@Component
public class AuthServerConfigurer extends WebSecurityConfigurerAdapter
{
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    public PasswordEncoder passwordEncoder;

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(final AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder);
    }
    /*

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers("/oauth/**").permitAll()
        .antMatchers("/oauth/token/**").permitAll()
        .antMatchers("/api/**" ).authenticated()
        .anyRequest().authenticated()
        .and().formLogin().permitAll()
        .and().csrf().disable();

    }
    */
    
    @Autowired  //Método de configuración, los argumentos son inyectados y permite obtener Beans del context
    public void setApplicationContext(ApplicationContext context) 
    {
        super.setApplicationContext(context);
        AuthenticationManagerBuilder globalAuthBuilder = context.getBean(AuthenticationManagerBuilder.class);
        try {
            globalAuthBuilder.userDetailsService(userDetailsService);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    
    
    
    
}
        
        
        /*
        
        AuthorizationServerConfigurerAdapter {

    @Autowired
    private TokenStore tokenStore;

    AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;
    
    public AuthServerConfigurer(AuthenticationConfiguration authenticationConfiguration) throws Exception 
    {
        this.authenticationManager = authenticationConfiguration.getAuthenticationManager();
    }
    
    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) throws Exception 
    {
        endpoints.tokenStore(tokenStore);
        endpoints.userDetailsService(userDetailsService);
        endpoints.authenticationManager(authenticationManager)
                    .approvalStoreDisabled();
    }
    
}
*/



