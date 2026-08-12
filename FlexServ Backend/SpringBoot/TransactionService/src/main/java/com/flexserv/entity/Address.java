package com.flexserv.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "house_no", length = 50)
    private String houseNo;

    @Column(name = "street", length = 150)
    private String street;

    @Column(name = "area", length = 100)
    private String area;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "pincode", length = 10)
    private String pincode;

    public String getFullAddress() {
        StringBuilder sb = new StringBuilder();
        if (houseNo != null && !houseNo.isEmpty()) sb.append(houseNo).append(", ");
        if (street != null && !street.isEmpty()) sb.append(street).append(", ");
        if (area != null && !area.isEmpty()) sb.append(area).append(", ");
        if (city != null && !city.isEmpty()) sb.append(city).append(", ");
        if (state != null && !state.isEmpty()) sb.append(state).append(" - ");
        if (pincode != null && !pincode.isEmpty()) sb.append(pincode);
        return sb.toString().trim();
    }
}
