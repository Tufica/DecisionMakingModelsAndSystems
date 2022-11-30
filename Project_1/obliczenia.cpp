#include<bits/stdc++.h>

using namespace std;
ifstream in;
ofstream out,out_Htable;

int const R=2,C=4;
int decisionMakingTable[R][C];
int average[C];
string columnNames[C]={"status_quo","expansion","building_HQ","collaboration"};


void importData(char *fileName)
{
    int value;
    in.open(fileName);
    for(int i=0;i<R;++i)
    {
        for(int j=0;j<C;++j)
        {
            in>>value;
            decisionMakingTable[i][j]=value;
        }
    }
    in.close();
}

int avg(int a,int b)
{
    return((a+b)/2);
}

int averageTable()
{
    for(int j=0;j<C;++j)
        average[j]=avg(decisionMakingTable[0][j],decisionMakingTable[1][j]);
    return 0;
}

void optimisticApproach()
{
    int result=decisionMakingTable[1][0];
    string column=columnNames[0];
    for(int i=1;i<C;++i)
    {
        if(result<decisionMakingTable[1][i])
        {
            result=decisionMakingTable[1][i];
            column=columnNames[i];
        }
    }
    out<<"Optimistic Approach: "<<column<<" -> "<<result;
}

void pesimisticApproach()
{
    int result=decisionMakingTable[0][0];
    string column=columnNames[0];
    for(int i=1;i<C;++i)
    {
        if(result<decisionMakingTable[0][i])
        {
            result=decisionMakingTable[0][i];
            column=columnNames[i];
        }
    }
    out<<"\nPesimistic Approach: "<<column<<" -> "<<result;
}

void LaplaceMethod()
{
    int result=average[0];
    string column=columnNames[0];
    for(int i=1;i<C;++i)
    {
        if(result<average[i])
        {
            result=average[i];
            column=columnNames[i];
        }
    }
    out<<"\nLaplace Method: "<<column<<" -> "<<result;
}

void savageMethod()
{
    int maxValueInRow0=decisionMakingTable[0][0],maxValueInRow1=decisionMakingTable[1][0];
    for(int i=1;i<C;++i)
    {
        maxValueInRow0=max(maxValueInRow0,decisionMakingTable[0][i]);
        maxValueInRow1=max(maxValueInRow1,decisionMakingTable[1][i]);
    }

    int savageTable[R][C]=
    {
        abs(maxValueInRow0-decisionMakingTable[0][0]),abs(maxValueInRow0-decisionMakingTable[0][1]),abs(maxValueInRow0-decisionMakingTable[0][2]),abs(maxValueInRow0-decisionMakingTable[0][3]),
        abs(maxValueInRow1-decisionMakingTable[1][0]),abs(maxValueInRow1-decisionMakingTable[1][1]),abs(maxValueInRow1-decisionMakingTable[1][2]),abs(maxValueInRow1-decisionMakingTable[1][3])
    };
    int savageTable2[C]=
    {
        max(savageTable[0][0],savageTable[1][0]),
        max(savageTable[0][1],savageTable[1][1]),
        max(savageTable[0][2],savageTable[1][2]),
        max(savageTable[0][3],savageTable[1][3])
    };

    string column=columnNames[0];
    int result=savageTable2[0];
    for(int i=1;i<C;++i)
    {
        if(result>savageTable2[i])
        {
            result=savageTable2[i];
            column=columnNames[i];
        }
    }
    out<<"\nSavage (least regret) Method: "<<column<<" -> "<<result;
}

void HurwitzMethod()
{
    out<<"\nHurwitz Method (criteria):\n";
    out_Htable<<"h "<<columnNames[0];

    for(int i=1;i<C;++i)
        out_Htable<<" "<<columnNames[i];
    for(float h=0;h<1.1;h+=+0.1)
    {
        out_Htable<<"\n"<<h;
        for(int i=0;i<C;++i)
        {
            out_Htable<<" "<<(1-h)*decisionMakingTable[0][i]+h*decisionMakingTable[1][i];
        }
        out<<"\n";
    }
}

int main()
{
    out.open("results.txt");
    out_Htable.open("data_Htable.txt");
    importData("input_data.txt");
    averageTable();

    optimisticApproach();
    pesimisticApproach();
    LaplaceMethod();
    savageMethod();
    HurwitzMethod();

    return 0;
}