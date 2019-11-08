#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using namespace std;

const int8_t mask = 0b01101101; // 1バイトのパターン

int main()
{

	// ファイル名を入力
	string in_Path, out_Path;
	cout << "Infile:";
	cin >> in_Path;
	cout << "Outfile:";
	cin >> out_Path;

	fstream fin(in_Path, ios::in | ios::binary); // 読み取り専用 | バイナリとして読み込む

	if (!fin) // エラー処理
	{
		cout << "error_Can'tOpen" << endl;
		return -1;
	}
	cout << "Opened" << endl;

	int8_t a;
	vector<int8_t> b;

	while (!fin.eof())
	{
		fin.read((char*)&a, 1);

		// 暗号化
		a = a ^ mask;

		b.push_back(a); // 後ろにくっつける
	}

	b.pop_back(); // 後ろから一つ消す
	fin.close(); //とじる

	/// ここに出力の処理 ///
	fstream fo;

	// 書き込みファイルを開く(作る)
	fo.open(out_Path, ios::out | ios::binary | ios::trunc);

	// 書き込み
	for (int i = 0; i < b.size(); i++)
	{
		fo.write((char*)&b[i], 1);
	}

	cout << "wrote" << endl;

	fo.close();
	return 0;
}
