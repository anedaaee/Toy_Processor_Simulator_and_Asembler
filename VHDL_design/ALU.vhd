library ieee;
use ieee.STD_LOGIC_1164.all;
use ieee.numeric_std.all;


entity ALU is 
	generic (au_bw : integer := 16);
	port (
		in_1,in_2 : in std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		op : in std_logic_vector(2 downto 0) := (others => '0');
		c_in : in std_logic := '0';
		c_prev : in std_logic;
		f : out std_logic_vector(au_bw - 1 downto 0) := (others => '0');
		z,c : out std_logic := '0'
	);
end ALU;


architecture Behavioral of ALU is

	component AU is 
		generic (au_bw : integer := 16);
		port (
			a,b : in std_logic_vector(au_bw - 1 downto 0);
			c_in : in std_logic;
			c_prev : in std_logic; 
			output : out std_logic_vector(au_bw - 1 downto 0);
			cout : out std_logic
		);
	end component;

	component ROR_function is 
		generic (au_bw : integer := 16);
		port (
			a: in std_logic_vector(au_bw - 1 downto 0);
			c_in : in std_logic;
			output : out std_logic_vector(au_bw - 1 downto 0);
			cout : out std_logic
		);
	end component;

	component And_unit is 
		generic (au_bw : integer := 16);
		port (
			a,b: in std_logic_vector(au_bw - 1 downto 0);
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component Or_unit is 
		generic (au_bw : integer := 16);
		port (
			a,b: in std_logic_vector(au_bw - 1 downto 0);
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component Xor_unit is 
		generic (au_bw : integer := 16);
		port (
			a,b: in std_logic_vector(au_bw - 1 downto 0);
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	component Mux_8 is 
		generic (au_bw : integer := 16);
		port (
			input_0 ,input_1 ,input_2 ,input_3 ,input_4 ,input_5 ,input_6 ,input_7 : in std_logic_vector(au_bw - 1 downto 0);
			sel : in std_logic_vector(2 downto 0);
			clk : in std_logic := '0';
			output : out std_logic_vector(au_bw - 1 downto 0)
		);
	end component;

	signal zero_value,au_out,ror_out,and_out,xor_out,or_out,temp_out: std_logic_vector(au_bw - 1 downto 0) := (others => '0');
	signal temp_c_au,temp_c_ror : std_logic := '0';
begin

	au_ins : AU port map(a => in_1 , b => in_2 , c_in => c_in , output => au_out , cout => temp_c_au  , c_prev => c_prev);
	ror_ins : ROR_function port map (a => in_1 , c_in => c_in , output => ror_out , cout => temp_c_ror);
	and_ins : And_unit port map (a => in_1 , b => in_2 , output => and_out);
	or_ins : Or_unit port map (a => in_1 , b => in_2 , output => or_out );
	xor_ins : Xor_unit port map (a => in_1 , b => in_2 , output => xor_out );
	mux_8_in : Mux_8 port map (
		input_0 => ror_out,
		input_1 => and_out,
		input_2 => or_out,
		input_3 => xor_out,
		input_4 => au_out,
		input_5 => zero_value,
		input_6 => zero_value,
		input_7 => zero_value,
		sel => op,
		output => temp_out
	);
	

	process(in_1,in_2,op,temp_out)

	begin

			f <= temp_out;
			c <= temp_c_ror or temp_c_au;
			if temp_out = zero_value then 
				z <= '1';
			else 
				z <= '0';
			end if;
	end process;


end Behavioral;
