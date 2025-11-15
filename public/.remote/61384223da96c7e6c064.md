---
title: AWS ネットワーク構成図サンプル（VPC）
tags:
  - Network
  - AWS
  - PlantUML
  - vpc
private: false
updated_at: '2024-12-23T07:05:03+09:00'
id: 61384223da96c7e6c064
organization_url_name: works-hi
slide: false
ignorePublish: false
---
# はじめに

AWSの最初の壁の1つであるネットワークについて敷居を下げられるよう、標準的な構成を簡単ですが纏めました。

どこかしらには書いてある構成ですが、色々と見て回らずに比較できるようにしました。

# VPC

時間の都合でゲートウェイをメインに、エンドポイントは対象外にしました。

https://docs.aws.amazon.com/vpc/

## Private Subnet

### 単一 VPC 

- 初期状態です
- VPC内だけ接続できます
- VPC外とは接続できません

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction

AWSCloudGroup(cloud){
    VPCGroup(vpc,VPC){
      PrivateSubnetGroup(private,"Private Subnet") {
        EC2(ec21,"EC2","")
        EC2(ec22,"EC2","")
      }
    }
}

ec21-r->ec22

@enduml
```

### VPC 間接続：VPC Peering

- 同一アカウント内のVPCと接続できます

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist

!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/GenericAlt.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/NetworkingContentDelivery/VPCPeeringConnection.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
    VPCGroup(vpc1,VPC){
      PrivateSubnetGroup(private1,"Private Subnet") {
        EC2(ec21,"EC2","")
      }
    }
    GenericAltGroup(group,"") {
      VPCPeeringConnection(peering,"VPC Peering","")
    }
    
    VPCGroup(vpc2,VPC){
      PrivateSubnetGroup(private2,"Private Subnet") {
        EC2(ec22,"EC2","")
      }
    }
}

ec21-r->peering
vpc1-r[hidden]->peering
peering-r[hidden]->vpc2
peering-r->ec22

@enduml
```

https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-peering.html

### VPC 間接続：Subnet Sharing

- 共有したSubnetで、異なるアカウントと接続します

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/ManagementGovernance/Organizations.puml
!include AWSPuml/NetworkingContentDelivery/VPCInternetGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCNATGateway.puml
!include AWSPuml/SecurityIdentityCompliance/ResourceAccessManager.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

Organizations(organization,"AWS Organization","AWS Organization") {

    ResourceAccessManager(ram, "Resource Access Manage","")

    AWSCloudGroup(cloud1,"VPC Owner"){
        VPCGroup(vpc1,"Shared VPC"){
          PrivateSubnetGroup(private1,"Private Subnet (Share)") {
            EC2(ec21,"EC2","")
          }
        }
    }
    
    AWSCloudGroup(cloud2,"VPC Paticipant"){
        VPCGroup(vpc2,"Shared VPC"){
          PrivateSubnetGroup(private2,"Private Subnet (Shared)") {
            EC2(ec22,"EC2","")
          }
        }
    }

}

vpc1-u->ram:share
ram-d->vpc2:shared
private1-u[hidden]->ram
private1-r-private2:同一

@enduml
```

- [共有したSubnetを利用できるリソースには制限がある](https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-sharing-service-behavior.html)

https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-sharing.html

### VPC 間接続：Transit Gateway

- 異なるアカウントのVPCと接続できます

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist

!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/CorporateDataCenter.puml
!include AWSPuml/Groups/GenericAlt.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/Groups/Region.puml
!include AWSPuml/General/Traditionalserver.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/NetworkingContentDelivery/VPCVPNGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCCustomerGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnectGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnect.puml
!include AWSPuml/NetworkingContentDelivery/TransitGateway.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

GenericAltGroup(ga,"") {
    AWSCloudGroup(cloud1){
        VPCGroup(vpc1,VPC){
            EC2(ec21,"EC2","")
        }
    }
    
    AWSCloudGroup(cloud2){
      VPCGroup(vpc2,VPC){
          EC2(ec22,"EC2","")
      }
    }
}

AWSCloudGroup(cloud3){
    TransitGateway(tgw, "Transit Gateway", "")
}


vpc1-r->tgw


vpc1-d[hidden]-vpc2

vpc2-r->tgw

cloud1-r[hidden]->cloud2


@enduml
```

https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/what-is-transit-gateway.html

## Public Subnet：Internet Gateway

### Public Subnet

- インターネットに公開されます

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/NetworkingContentDelivery/VPCInternetGateway.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
    VPCGroup(vpc,VPC){
      PublicSubnetGroup(public,"Public Subnet") {
        EC2(ec2,"EC2","")
      }
      VPCInternetGateway(igw,"Internet Gateway","")
    }
}
Internet(internet,"Internet","")

ec2<-r->igw
igw<-r->internet

@enduml
```

https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/VPC_Internet_Gateway.html

### Private Subnet + NAT Gateway

- 公開せずに、インタネットにアクセスできます

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/NetworkingContentDelivery/VPCInternetGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCNATGateway.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
    VPCGroup(vpc,VPC){
      PrivateSubnetGroup(private,"Private Subnet") {
        EC2(ec2,"EC2","")
      }
      PublicSubnetGroup(public,"Public Subnet") {
        VPCNATGateway(nat,"NAT Gateway","")
      }
      VPCInternetGateway(igw,"Internet Gateway","")
    }
}
Internet(internet,"Internet","")

ec2-r->nat
nat<-r->igw
igw<-r->internet

@enduml
```

- V4 IP Adress: NAT Gateay
- V6 IP Adress: Egress-only Internet Gateway

https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/vpc-nat-gateway.html

https://docs.aws.amazon.com/ja_jp/vpc/latest/userguide/egress-only-internet-gateway.html

### Public / Private Subnet + NAT Gateway

- 公開・非公開サーバーの組み合わせです

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/NetworkingContentDelivery/VPCInternetGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCNATGateway.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
    VPCGroup(vpc,VPC){
      PrivateSubnetGroup(private,"Private Subnet") {
        EC2(ec21,"EC2","")
      }
      PublicSubnetGroup(public,"Public Subnet") {
        EC2(ec22,"EC2","")
        VPCNATGateway(nat,"NAT Gateway","")
      }
      VPCInternetGateway(igw,"Internet Gateway","")
    }
}
Internet(internet,"Internet","")

ec21<-r->ec22
ec21-r->nat
nat<-r->igw
ec22<-r->igw
ec22-d[hidden]->nat
igw<-r->internet

@enduml
```

## AWS Site-to-Site VPN

https://docs.aws.amazon.com/ja_jp/vpn/latest/s2svpn/Examples.html

### 単一接続

- 自社環境に1台接続できます

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/CorporateDataCenter.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/General/Traditionalserver.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/NetworkingContentDelivery/VPCVPNGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCCustomerGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCVPNConnection.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
  VPCGroup(vpc,VPC){
    PrivateSubnetGroup(private,"Private Subnet") {
      EC2(ec21,"EC2","")
    }
    VPCVPNGateway(vgw,"Virtual Private Gateway","")
  }
}

VPCVPNConnection(connection,"VPN Connection","")
    
CorporateDataCenterGroup(corporate,"Corporate") {
  VPCCustomerGateway(customer,"Customer Gateway","")
  Traditionalserver(server,"Server","")
}

ec21-r->vgw
vgw-r->connection
connection-r->customer
customer-r->server

@enduml
```

## Direct Connect

https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/Welcome.html

### 単一接続：Virtual Private Gateway

- 自社環境に専用線で1台接続できます
- あまり利用されない

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/CorporateDataCenter.puml
!include AWSPuml/Groups/Generic.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/General/Traditionalserver.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/NetworkingContentDelivery/VPCVPNGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCCustomerGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnectGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnect.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
  VPCGroup(vpc,VPC){
    PrivateSubnetGroup(private,"Private Subnet") {
      EC2(ec21,"EC2","")
    }
    VPCVPNGateway(vgw,"Virtual Private Gateway","")
  }
}

DirectConnect(connection,"Direct Connect","")
    
CorporateDataCenterGroup(corporate,"Corporate") {
  VPCCustomerGateway(customer,"Customer Gateway","")
  Traditionalserver(server,"Server","")
}

ec21-r->vgw
vgw-r->connection:Private VIF
connection-r->customer:専用線
customer-r->server

@enduml
```

- 仮想インターフェイス:Private VIF

### 複数接続：20以下：Virtual Private Gateway / Direct Connect Gateway

- 自社環境に専用線で20台まで接続できます
- 単一でも次のこの構成にしておくと拡張が容易である

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/CorporateDataCenter.puml
!include AWSPuml/Groups/GenericAlt.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/Groups/Region.puml
!include AWSPuml/General/Traditionalserver.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/NetworkingContentDelivery/VPCVPNGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCCustomerGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnectGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnect.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

AWSCloudGroup(cloud){
  GenericAltGroup(ga,"") {
      RegionGroup(region1, "Region") {
          VPCGroup(vpc1,VPC){
            PrivateSubnetGroup(private1,"Private Subnet") {
              EC2(ec21,"EC2","")
            }
            VPCVPNGateway(vgw1,"Virtual Private Gateway","")
          }
      }
      RegionGroup(region2, "Region") {
          VPCGroup(vpc2,VPC){
            PrivateSubnetGroup(private2,"Private Subnet") {
              EC2(ec22,"EC2","")
            }
            VPCVPNGateway(vgw2,"Virtual Private Gateway","")
          }
      }
  }
  DirectConnectGateway(dgw,"Direct Connect Gateway","")
}

DirectConnect(connection,"Direct Connect","")
    
CorporateDataCenterGroup(corporate,"Corporate") {
  VPCCustomerGateway(customer,"Customer Gateway","")
  Traditionalserver(server,"Server","")
}

ec21-r->vgw1
vgw1-r->dgw

region1-[hidden]d-region2

vpc1-[hidden]d-connection

ec22-r->vgw2
vgw2-r->dgw

dgw-r->connection:Private VIF
connection-r->customer:専用線
customer-r->server

@enduml
```

- 仮想インターフェイス:Private VIF
- VPC間接続:不可
- Direct Connect Gateway: 無料
- クォータ：[ゲートウェイあたりの仮想プライベート AWS Direct Connect ゲートウェイ:20](https://docs.aws.amazon.com/ja_jp/directconnect/latest/UserGuide/limits.html)
  - クォータは拡張不可

### 複数接続：5000以下：Transit Gateway / Direct Connect Gateway

- 自社環境に専用線で20台より多く接続できます

```plantuml
@startuml
!define AWSPuml https://raw.githubusercontent.com/awslabs/aws-icons-for-plantuml/v14.0/dist
!include AWSPuml/AWSCommon.puml
!include AWSPuml/Groups/AWSCloud.puml
!include AWSPuml/Groups/CorporateDataCenter.puml
!include AWSPuml/Groups/GenericAlt.puml
!include AWSPuml/Groups/VPC.puml
!include AWSPuml/Groups/PrivateSubnet.puml
!include AWSPuml/Groups/PublicSubnet.puml
!include AWSPuml/Groups/Region.puml
!include AWSPuml/General/Traditionalserver.puml
!include AWSPuml/General/Internet.puml
!include AWSPuml/Compute/EC2.puml
!include AWSPuml/NetworkingContentDelivery/VPCVPNGateway.puml
!include AWSPuml/NetworkingContentDelivery/VPCCustomerGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnectGateway.puml
!include AWSPuml/NetworkingContentDelivery/DirectConnect.puml
!include AWSPuml/NetworkingContentDelivery/TransitGateway.puml
!include AWSPuml/AWSSimplified.puml

top to bottom direction
skinparam linetype ortho

GenericAltGroup(ga,"") {
    AWSCloudGroup(cloud1){
        VPCGroup(vpc1,VPC){
            EC2(ec21,"EC2","")
        }
    }
    
    AWSCloudGroup(cloud2){
      VPCGroup(vpc2,VPC){
          EC2(ec22,"EC2","")
      }
    }
}

AWSCloudGroup(cloud3){
    TransitGateway(tgw, "Transit Gateway", "")
    DirectConnectGateway(dgw,"Direct Connect Gateway","")
}

DirectConnect(connection,"Direct Connect","")
    
CorporateDataCenterGroup(corporate,"Corporate") {
  VPCCustomerGateway(customer,"Customer Gateway","")
  Traditionalserver(server,"Server","")
}

vpc1-r->tgw


vpc1-d[hidden]-vpc2

vpc2-r->tgw

cloud1-r[hidden]->cloud2

tgw-r->dgw

dgw-r->connection:Transit VIF
connection-r->customer:専用線
customer-r->server

@enduml
```

- 仮想インターフェイス:Transit VIF
- VPC間接続:可能
- Transit Gateway:有料
- クォータ：[Transit Gateway あたりのアタッチメント：5000](https://docs.aws.amazon.com/ja_jp/vpc/latest/tgw/transit-gateway-quotas.html)
  - クォータは拡張不可

## 略語

良く出てくるGatewayの略語も記載しておきます。

- CGW: Customer Gateway
- D(X)GW: Direct Connect Gateway
- EIGW: Egress-only Internet Gateway
- IGW: Internet Gateway
- TGW: TransitGateway
- VGW: Virtual Private Gateway

## さいごに

ルートテーブルも書こうと欲を出したら半年寝かしてしまったので、諦めて公開する事にしました。

足りない点は多いですが、どなたかの理解の一助になれば幸いです。

## 参考

### PlantUMLでAWS構成図を描く方法の紹介サイト

https://qiita.com/sakai00kou/items/18e389fc85a8af59d9e0

#### アイコン一覧

https://github.com/awslabs/aws-icons-for-plantuml/blob/main/AWSSymbols.md

### 【AWS基礎】よく使うゲートウェイの特徴・違い・料金まとめ

詳細な設定方法が紹介されている。

https://ops.jig-saw.com/tech-cate/aws_gateway
